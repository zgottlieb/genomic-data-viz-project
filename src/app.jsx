import './App.css';

import { useState, useEffect } from 'react';
import VolcanoPlot from './volcano-plot';
import * as d3 from 'd3';

const tsvFilePath = '../data/GSE68086-GEOR2-output-crc-dea.tsv';

function App() {
  const [exampleData, setExampleData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parsedData = await d3.dsv('\t', tsvFilePath);
        console.log({ parsedData });
        setExampleData(parsedData);
      } catch (error) {
        console.error('Error loading or parsing the TSV file:', error);
      }
    };

    fetchData();
  }, []);

  if (exampleData?.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>Volcano Plot of Differential Expression</h1>
      <VolcanoPlot data={exampleData} />
    </div>
  );
}

export default App;
