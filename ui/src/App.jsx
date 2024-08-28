import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ListExample from './bootstrapStuffs/Navbar';
import DarkTable from './bootstrapStuffs/Table';
import Patrimoine from '../../models/Patrimoine';
import Possession from '../../models/possessions/Possession';

function App() {
  return (
    <div className="h-100 w-100 border border-dark">
      <ListExample></ListExample>
      <DarkTable></DarkTable>
    </div>
  )
}

export default App
