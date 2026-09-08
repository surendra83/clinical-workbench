from typing import List, Dict, Any, Optional, Tuple

import pandas as pd

def _parse_segments(member_id: str) -> Tuple:
    """
    Turn 'mdg_1.10.2' -> (1, 10, 2) for natural numeric sort.
    If non-numeric tokens appear, fall back to string order for that token.
    """
    if '_' in member_id:
        base = member_id.split('_', 1)[1]
    else:
        base = member_id
    parts = base.split('.') if base else []
    segs = []
    for p in parts:
        p = p.strip()
        if p.isdigit():
            segs.append(int(p))
        else:
            try:
                segs.append(int(p))
            except Exception:
                segs.append(p)
    return tuple(segs)

def _parent_of(member_id: str) -> Optional[str]:
    """
    Parent by trimming after last dot; 'mdg_1' is root → None.
    """
    if '_' in member_id:
        prefix, rest = member_id.split('_', 1)
        if '.' not in rest:
            return None
        parent_rest = rest.rsplit('.', 1)[0]
        return f"{prefix}_{parent_rest}"
    return None if '.' not in member_id else member_id.rsplit('.', 1)[0]

def validate_dataframe(df: pd.DataFrame, id_col: str, relation_col: str, content_col: str, question_col:str,classification_type_col:str,category_col:str) -> List[str]:
    """
    Return list of problems; empty list means OK.
    """
    problems = []
    for col in (id_col, relation_col, content_col,question_col,classification_type_col, category_col):
        if col not in df.columns:
            problems.append(f"Missing required column: {col}")
    if problems:
        return problems

    invalid_rows = []
    for i, v in enumerate(df[id_col].astype(str).tolist()):
        vv = v.strip()
        if vv == '' or vv.lower() == 'any':
            invalid_rows.append((i, v, 'empty_or_ANY'))
        if '_' not in vv:
            invalid_rows.append((i, v, 'missing_underscore'))
        else:
            after = vv.split('_', 1)[1]
            if after == '' or not any(ch.isdigit() for ch in after):
                invalid_rows.append((i, v, 'no_numeric_part'))
    if invalid_rows:
        details = '; '.join([f"row={i} value={repr(v)} reason={r}" for i, v, r in invalid_rows])
        problems.append(f"Invalid {id_col} detected: {details}")
    return problems

def df_to_hierarchical_json(
    df: pd.DataFrame,
    id_col: str = 'member_id',
    relation_col: str = 'logical_relation',
    content_col: str = 'content',
    question_col:str = 'question',
    classification_type_col: str = 'classification_type',
    category_col: str = 'category',
    seq_col: Optional[str] = None,
    include_seq: bool = True,
    return_single_root: bool = False,
    create_missing_parents: bool = False,
    hide_empty_children: bool = True,    # <-- NEW: remove children key if it’s empty
) -> Any:
    """
    Transform a flat DataFrame with dot-notated master_id into hierarchical JSON.

    - Orders siblings by seq_col if provided, else by natural numeric order of master_id.
    - Optionally include 'seq' in nodes.
    - Optionally create missing parents as stub nodes (content='', logical_relation='ANY').
    - Optionally hide 'children' when empty (leaf nodes).
    """
    problems = validate_dataframe(df, id_col, relation_col, content_col, question_col, classification_type_col,category_col)
    if problems:
        raise ValueError("; ".join(problems))

    df_work = df.copy()

    # Determine ordering
    if seq_col and seq_col in df_work.columns:
        df_work = df_work.sort_values(by=seq_col, kind='stable').reset_index(drop=True)
        order_keys = df_work[seq_col].tolist()
    else:
        df_work = df_work.sort_values(by=id_col, key=lambda s: s.astype(str).map(_parse_segments),
                                      kind='stable').reset_index(drop=True)
        order_keys = list(range(len(df_work)))

    # Normalize rows
    rows: List[Dict[str, Any]] = []
    for pos, row in enumerate(df_work[[id_col, relation_col, content_col, question_col,classification_type_col,category_col]].itertuples(index=False)):
        identifier, logical_relation, content,question,classification_type,category = row
        rows.append({
            'seq': order_keys[pos],
            id_col: str(identifier).strip(),
            relation_col: logical_relation,
            content_col: content,
            question_col: question,
            classification_type_col: classification_type,
            category_col: category
        })

    nodes: Dict[str, Dict[str, Any]] = {}

    # Create nodes
    for r in rows:
        mid = r[id_col]
        if mid not in nodes:
            nodes[mid] = {
                'member_id': mid,
                'content': r[content_col],
                'logical_relation': r[relation_col],
                'question':r[question_col],
                'classification_type':r[classification_type_col],
                'category':r[category_col],
                'children': []  # will prune later if empty and hide_empty_children=True
            }
            if include_seq:
                nodes[mid]['seq'] = r['seq']
        else:
            # duplicate IDs: keep first content; keep earliest seq
            if include_seq:
                nodes[mid]['seq'] = min(nodes[mid].get('seq', r['seq']), r['seq'])

    # Optionally create any missing parents
    if create_missing_parents:
        ids = list(nodes.keys())
        for mid in ids:
            p = _parent_of(mid)
            while p is not None and p not in nodes:
                nodes[p] = {
                    'member_id': p,
                    'content': '',
                    'logical_relation': 'ANY',
                    'question':'',
                    'classification_type':'',
                    'category':'',
                    'children': []
                }
                p = _parent_of(p)

    # Attach children
    roots: List[Dict[str, Any]] = []
    for mid, node in nodes.items():
        parent_id = _parent_of(mid)
        if parent_id is None or parent_id not in nodes:
            roots.append(node)
        else:
            nodes[parent_id]['children'].append(node)

    # Sort children (and roots)
    def _sort_children(node: Dict[str, Any]):
        ch = node.get('children', [])
        if not ch:
            return
        if include_seq:
            ch.sort(key=lambda n: n.get('seq', 0))
        else:
            ch.sort(key=lambda n: _parse_segments(n['member_id']))
        for c in ch:
            _sort_children(c)

    for r in roots:
        _sort_children(r)

    if include_seq:
        roots.sort(key=lambda n: n.get('seq', 0))
    else:
        roots.sort(key=lambda n: _parse_segments(n['member_id']))

    # --- NEW: prune empty children keys ---
    def _prune_empty_children(node: Dict[str, Any]):
        if 'children' in node:
            # Recurse first to allow deeper pruning
            for ch in list(node.get('children', [])):
                _prune_empty_children(ch)
            # If children now empty, remove the key
            if not node['children']:
                del node['children']

    if hide_empty_children:
        for root in roots:
            _prune_empty_children(root)

    if return_single_root and len(roots) == 1:
        return roots[0]
    return roots