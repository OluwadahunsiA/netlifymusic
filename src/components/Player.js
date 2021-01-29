import React, { useEffect } from "react";
import { playAudio } from "../util";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  timeUpdateHandler,
  songs,
  setCurrentSong,
}) => {
  // useEffect

  useEffect(() => {
    const newSongs = songs.map((song) => {
      if (song.id === currentSong.id) {
        return { ...song, active: true };
      } else {
        return { ...song, active: false };
      }
    });
  });

  //Ref to grab a specific component

  //Event Handlers

  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      // set isPlaying to the opposite value,in this case, "false"
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      // set isPlaying to the opposite value, in this case,"true"
      setIsPlaying(!isPlaying);
    }
  };

  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === "skip-back") {
      if ((currentIndex - 1) % songs.length === -1) {
        setCurrentSong(songs[songs.length] - 1);
        //this fixes the fact that it doesn't play when you skip
        if (isPlaying) audioRef.current.play();
        return;
      }
      setCurrentSong(songs[(currentIndex - 1) % songs.length]);
    }
    // Did this when debugging;

    if (isPlaying) audioRef.current.play();
  };

  //newly added
  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  //state in player

  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>

        <input
          min={0}
          max={songInfo.duration || 0}
          value={songInfo.currentTime}
          type="range"
          onChange={dragHandler}
        />

        {/* This is to make sure the duration doesn't show NaN when the song is yet to load completely */}
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-back")}
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => skipTrackHandler("skip-forward")}
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
        />
      </div>
    </div>
  );
};

export default Player;
