"use client";

import { useState } from 'react';
import ClientOnly from './ClientOnly';
import { HSNResultSkeleton, SearchInputSkeleton, InlineLoading } from './LoadingStates';

interface HSNResult {
  code: string;
  description: string;
  chapter?: string;
  heading?: string;
  subheading?: string;
  item?: string;
  uqc?: string;
  rta?: string;
  effectiveDate?: string;
  itcCode?: string;
}

interface HSNLookupResponse {
  success: boolean;
  query: string;
  results: HSNResult[];
  totalResults: number;
  source: string;
}

export default function HSNLookup() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<HSNResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || query.length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const response = await fetch(`/api/hsn-lookup?q=${encodeURIComponent(query)}`);
      const data: HSNLookupResponse = await response.json();

      if (data.success) {
        setResults(data.results);
        setShowResults(true);
      } else {
        setError('No results found');
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error('HSN lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setShowResults(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <ClientOnly fallback={
      <div className="hsn-lookup-container">
        <div className="hsn-input-section">
          <div className="input-group">
            <label className="input-label">🔍 HSN Code Lookup</label>
            <div className="input-wrapper">
              <div className="hsn-input" style={{height: '40px', border: '1px solid #ccc', borderRadius: '4px', padding: '8px'}}>
                Loading...
              </div>
              <div className="input-hint">Enter code or description to find HSN details</div>
            </div>
          </div>
        </div>
      </div>
    }>
      <div className="hsn-lookup-container">
        <div className="hsn-input-section">
          <div className="input-group">
            <label className="input-label">🔍 HSN Code Lookup</label>
            <div className="input-wrapper">
              <input
                type="text"
                className="hsn-input"
                placeholder="Enter HSN code or description (e.g., 1012100, cotton, steel)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <div className="input-hint">Enter code or description to find HSN details</div>
            </div>
          </div>

          <div className="hsn-actions">
            <button 
              className="btn-secondary" 
              onClick={handleClear}
              disabled={loading}
            >
              🗑️ Clear
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? '⏳ Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="mt-4">
          <HSNResultSkeleton />
        </div>
      )}

      {showResults && results.length > 0 && !loading && (
        <div className="hsn-results">
          <div className="results-header">
            <h4>📋 Found {results.length} result(s) for &quot;{query}&quot;</h4>
          </div>
          
          <div className="results-list">
            {results.slice(0, 5).map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-code">{result.code}</div>
                <div className="result-description">{result.description}</div>
                
                <div className="result-details">
                  {result.chapter && (
                    <div className="detail-row">
                      <strong>Chapter:</strong> {result.chapter}
                    </div>
                  )}
                  {result.heading && (
                    <div className="detail-row">
                      <strong>Heading:</strong> {result.heading}
                    </div>
                  )}
                  {result.subheading && (
                    <div className="detail-row">
                      <strong>Subheading:</strong> {result.subheading}
                    </div>
                  )}
                  {result.item && (
                    <div className="detail-row">
                      <strong>Item:</strong> {result.item}
                    </div>
                  )}
                  
                  <div className="meta-info">
                    {result.uqc && <span className="meta-tag">UQC: {result.uqc}</span>}
                    {result.rta && <span className="meta-tag">RTA: {result.rta}</span>}
                    {result.effectiveDate && <span className="meta-tag">Date: {result.effectiveDate}</span>}
                  </div>
                </div>
              </div>
            ))}
            
            {results.length > 5 && (
              <div className="more-results">
                ... and {results.length - 5} more results
              </div>
            )}
          </div>
        </div>
      )}

        {showResults && results.length === 0 && !error && (
          <div className="no-results">
            <p>No results found for &quot;{query}&quot;. Try a different search term.</p>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
