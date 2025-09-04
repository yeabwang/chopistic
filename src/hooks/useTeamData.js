import { useState, useEffect } from 'react';

export const useTeamData = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const response = await fetch('/data/team/all_teams.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch team data: ${response.status}`);
        }
        const data = await response.json();
        setTeamData(data);
      } catch (error) {
        console.error('Error loading team data:', error);
        setTeamData(null);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  return { teamData, loading };
};
