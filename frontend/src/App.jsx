import Header from './components/Layout/Header';
import SubmitTicket from './pages/SubmitTicket';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <SubmitTicket />
      </main>
    </div>
  );
}

export default App;

