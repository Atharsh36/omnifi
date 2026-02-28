import { useState } from 'react';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/credit`;

export function useRiskEngine() {
  const [creditScore, setCreditScore] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchCreditScore = async (address: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/score/${address}`);
      const data = await response.json();
      setCreditScore(data.score);
      setAnalysis(data.analysis);
      return data;
    } catch (error) {
      console.error('Fetch credit score error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCreditScore = async (address: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/update/${address}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setCreditScore(data.score);
      }
      return data;
    } catch (error) {
      console.error('Update credit score error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { creditScore, analysis, fetchCreditScore, updateCreditScore, loading };
}
