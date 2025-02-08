import dayjs from 'dayjs';
//import data from './MOCK_DATA.json';
//import data from './SDI121109B14_2024_12.json';
import SimpleTable from './components/SimpleTable';
import { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const baseUrl = 'https://83f3f6c6-226f-469b-96bd-c21c881c23dd.mock.pstmn.io/data-clients?';

  
  useEffect(() => {
    const fetchAllData = async () => {
      let allData = [];
      
      for (let i = 0; i < 6; i++) {
        try {
          const response = await fetch(`${baseUrl}page=${i + 1}`);       
          if (!response.ok) throw new Error(`Error en la petición ${i}: ${response.status}`);

          const jsonData = await response.json();
          allData = [...allData, ...jsonData];

        } catch (error) { console.error(`Error en la petición ${i + 1}:`, error) }
      }

      if (allData.length > 0) {
        setData(allData);
        generateColumns(allData[0]); // Generar columnas dinámicamente
      }
    };

    fetchAllData();
  }, []);

  const generateColumns = (firstRow) => {
    const generatedColumns = Object.keys(firstRow).map(key => ({
      header: key.replace(/_/g, ' '),
      accessorKey: key,
      footer: key.replace(/_/g, ' '),
      ...(key.includes('FECHA') && { 
        cell: info => dayjs(info.getValue()).format('DD/MM/YYYY')
      })
    }));
    setColumns(generatedColumns);
  };

  return (
    <div>
      {data.length > 0 ? (
        <SimpleTable data={data} columns={columns} />
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default App
