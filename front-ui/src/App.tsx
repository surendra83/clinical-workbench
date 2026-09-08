import './App.css';

// Sample static data – no external HTTP client or routing library used.
const SAMPLE_TASKS = [
  { id: '1', code: 'CPT-99213', type: 'MCG',  title: 'Office visit – established patient',  dueDate: '2024-09-01', priority: 'High',   status: 'In Progress' },
  { id: '2', code: 'CPT-70553', type: 'LCD',  title: 'MRI brain without contrast',          dueDate: '2024-09-15', priority: 'Medium', status: 'Pending' },
  { id: '3', code: 'CPT-27447', type: 'NCD',  title: 'Total knee arthroplasty',             dueDate: '2024-10-01', priority: 'Low',    status: 'Completed' },
];

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>Clinical Workbench</h1>
        <span className="badge">Archived</span>
      </header>

      <section className="task-section">
        <h2>Sample Templates</h2>
        <table className="task-table">
          <thead>
            <tr>
              <th>Procedure Code</th>
              <th>Document Type</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_TASKS.map((t) => (
              <tr key={t.id}>
                <td>{t.code}</td>
                <td>{t.type}</td>
                <td>{t.title}</td>
                <td>{t.dueDate}</td>
                <td>{t.priority}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

export default App;
