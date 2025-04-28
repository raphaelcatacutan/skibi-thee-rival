import Header from '../components/Header'
import React, { useEffect, useState } from 'react'
import styling from '../styles/page-Leaderboards.module.css'

// to be commented out
const leaderboardData = [
  {rank_no: 1, player_name: 'Skibidi Rizz sIGMA DAWDASDS', win: 5},
  {rank_no: 1, player_name: 'Skibidi', win: 5},
  {rank_no: 1, player_name: 'Skibidi', win: 15},
  {rank_no: 1, player_name: 'Skibidi', win: 5}
]

export default function(){

  /* FETCH LEADERBOARD DATA FROM DB
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    async function fetchLeaderboard() {
      const response = await fetch('https://your-api-url.com/leaderboard');
      const data = await response.json();
      setLeaderboardData(data);
    }

    fetchLeaderboard();
  }, []);
  */

  const [audioPlayed, setAudioPlayed] = useState(false);
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!audioPlayed) {
        const audio = document.getElementById('background-music') as HTMLAudioElement | null;
        if (audio) {
          audio.play();
          setAudioPlayed(true); 
        }
      }
    };
    document.addEventListener('click', handleUserInteraction);
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [audioPlayed]); 
  
  return(
    <div className={styling.background_img}>
      <audio id="background-music" src="/assets/sounds/bgmusic.mp3" loop hidden />
      <div className={styling.rank_cont}>
        <div id={styling.leaderboard_text}>Leaderboards</div>
        <div id={styling.rank_list}>
            {leaderboardData.slice(0, 10).map((player) => (
              <div className={styling.rank_slot} key={player.rank_no}>
                <div className={styling.rank_count}>{player.rank_no}</div>
                <div className={styling.rank_name}>{player.player_name}</div>
                <div className={styling.rank_win}>{player.win}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

