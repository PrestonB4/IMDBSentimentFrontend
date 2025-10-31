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

      <div className="walkthrough">
        <h2>How This Model Was Built</h2>
        <ul style={{ textAlign: 'left' }}>
          <li><strong>Dataset:</strong> IMDB movie reviews with 50/50 positive/negative balance.</li>
          <li><strong>Cleaning:</strong> HTML tags, punctuation, and stopwords removed; lowercased.</li>
          <li><strong>Vectorization:</strong> Used TF-IDF with unigrams and bigrams.</li>
          <li><strong>Model:</strong> Trained using Logistic Regression and improved with Linear SVC.</li>
          <li><strong>Evaluation:</strong> 90% accuracy with detailed confusion matrix and metrics.</li>
          <li><strong>Deployment:</strong> Model integrated into this app for real-time sentiment prediction.</li>
        </ul>
        <p style={{ marginTop: '1em' }}>
          View the full notebook for code, preprocessing steps, and model evaluations.
        </p>
      </div>
    </div>
  );
}

export default App;
