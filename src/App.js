import React, { useState } from 'react';
import './App.css';
import GaugeChart from 'react-gauge-chart';

function App() {
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://imdb-sentiment-backend.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Server error or not running.' });
    }
  };

  return (
    <div className="App">
      <h1>Movie Review Sentiment Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="6"
          placeholder="Enter a movie review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
        />
        <br />
        <button type="submit">Analyze</button>
      </form>

      {result && (
        <div className="result">
          {result.error ? (
            <p className="error">{result.error}</p>
          ) : (
            <>
              <p><strong>Sentiment:</strong> {result.sentiment}</p>
              <p><strong>Score:</strong> {result.score.toFixed(4)}</p>
              <p><strong>Gauge:</strong> {result.gauge}</p>
              <GaugeChart
                id="sentiment-gauge"
                nrOfLevels={20}
                percent={result.score}
                textColor="#000000"
                colors={["#FF0000", "#FFFF00", "#00FF00"]}
              />
            </>
          )}
        </div>
      )}

      <hr style={{ margin: '40px 0' }} />

      <div className="walkthrough" style={{ textAlign: 'left' }}>
        <h2>How This Model Was Built</h2>
        <ul>
          <li><strong>Dataset:</strong> IMDB movie reviews with 50/50 positive/negative balance.</li>
          <li><strong>Cleaning:</strong> Removed HTML tags, punctuation, stopwords; converted to lowercase.</li>
          <li><strong>Vectorization:</strong> TF-IDF with unigrams and bigrams.</li>
          <li><strong>Model:</strong> Trained using Logistic Regression and improved with Linear SVC.</li>
          <li><strong>Evaluation:</strong> Achieved 90% accuracy with confusion matrix and evaluation metrics.</li>
          <li><strong>Deployment:</strong> Integrated into this React app with real-time predictions.</li>
        </ul>
        <p style={{ marginTop: '1em' }}>
          📓 See the full notebook for preprocessing steps, code, and model evaluation.
        </p>
      </div>
    </div>
  );
}

export default App;
