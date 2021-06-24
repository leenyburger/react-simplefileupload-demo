import './App.css';
import  SimpleFileUpload  from 'react-simple-file-upload';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple File Upload Demo</h1>
        <a className="btn" href="https://simplefileupload.com">
          Try it now!
        </a>
      </header>
      <main>
        <div className="upload-wrapper">
          <SimpleFileUpload
            apiKey="2e7792d9a1cfd35dbef192d26f5ed176"
            onSuccess={handleUpload}
            preview="false"
          />
        </div>
       </main>
    </div>
  );
}

export default App;
