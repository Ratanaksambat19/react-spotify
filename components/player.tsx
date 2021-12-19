import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from "@chakra-ui/react";
import ReactHowler from "react-howler";
import { useEffect, useRef, useState } from "react";
import {
  MdShuffle,
  MdSkipPrevious,
  MdSkipNext,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineRepeat,
  MdPause,
  MdPauseCircleFilled,
  MdRepeat,
} from "react-icons/md";
import { useStoreActions } from "easy-peasy";
import { formatTime } from "../lib/formatters";

const Player = ({ songs, activeSong }) => {
  const [playing, setPlaying] = useState(true);
  const [index, setIndex] = useState(
    songs.findIndex((s) => s.id === activeSong.id)
  );
  const [seek, setSeek] = useState(0.0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const soundRef = useRef(null);
  const repeatRef = useRef(repeat);
  const setActiveSong = useStoreActions((state: any) => state.changeActiveSong);
  useEffect(() => {
    let timerId;

    if (playing && !isSeeking) {
      const f = () => {
        setSeek(soundRef.current.seek());
        timerId = requestAnimationFrame(f);
      };
      timerId = requestAnimationFrame(f);
      return () => cancelAnimationFrame(timerId);
    }
    cancelAnimationFrame(timerId);
  }, [playing, isSeeking]);
  const setPlayState = (value) => {
    setPlaying(value);
  };

  useEffect(() => {
    setActiveSong(songs[index]);
  }, [index, setActiveSong, songs]);

  const onShuffle = () => {
    setShuffle((state) => !state);
  };

  const onRepeat = () => {
    setRepeat((state) => !state);
  };

  useEffect(() => {
    repeatRef.current = repeat;
  }, [repeat]);

  const prevSong = () => {
    setIndex((state) => {
      return state ? state - 1 : songs.length - 1;
    });
  };

  const nextSong = () => {
    setIndex((state) => {
      if (shuffle) {
        const next = Math.floor(Math.random() * songs.length);
        if (next === state) {
          return nextSong();
        }
        return next;
      }
      return state === songs.length - 1 ? 0 : state + 1;
    });
  };

  const onEnd = () => {
    if (repeatRef.current) {
      setSeek(0);
      soundRef.current.seek(0);
    } else {
      nextSong();
    }
  };

  const onLoad = () => {
    const songDuration = soundRef.current.duration();
    setDuration(songDuration);
  };

  const onSeek = (e) => {
    setSeek(parseFloat(e[0]));
    soundRef.current.seek(e[0]);
  };
  return (
    <Box>
      <Box>
        <ReactHowler
          playing={playing}
          src={activeSong?.url}
          ref={soundRef}
          onLoad={onLoad}
          onEnd={onEnd}
        />
      </Box>
      <Center color="gray.600">
        <ButtonGroup>
          <IconButton
            outline="none"
            variant="link"
            aria-label="suffle"
            fontSize="20px"
            color={shuffle ? "white" : "grey.600"}
            onClick={onShuffle}
          >
            <MdShuffle />
          </IconButton>
          <IconButton
            outline="none"
            variant="link"
            aria-label="skip"
            fontSize="24px"
            onClick={prevSong}
          >
            <MdSkipPrevious />
          </IconButton>
          {playing ? (
            <IconButton
              outline="none"
              variant="link"
              color="white"
              aria-label="pause"
              fontSize="40px"
              onClick={() => setPlayState(false)}
            >
              <MdPauseCircleFilled />
            </IconButton>
          ) : (
            <IconButton
              outline="none"
              variant="link"
              color="white"
              aria-label="play"
              fontSize="40px"
              onClick={() => setPlayState(true)}
            >
              <MdOutlinePlayCircleFilled />
            </IconButton>
          )}
          <IconButton
            outline="none"
            variant="link"
            aria-label="skip next"
            fontSize="24px"
            onClick={nextSong}
          >
            <MdSkipNext />
          </IconButton>

          <IconButton
            outline="none"
            variant="link"
            aria-label="reapeat"
            fontSize="24px"
            color={repeat ? "white" : "grey.600"}
            onClick={onRepeat}
          >
            <MdRepeat />
          </IconButton>
        </ButtonGroup>
      </Center>
      <Box color="grey.600">
        <Flex justify="center" align="center">
          <Box width="5%">
            <Text fontSize="xs">{formatTime(seek)}</Text>
          </Box>
          <Box width="90%">
            <RangeSlider
              aria-label={["min", "max"]}
              step={0.1}
              min={0}
              max={duration ? (duration.toFixed(2) as unknown as number) : 0}
              onChange={onSeek}
              value={[seek]}
              onChangeStart={() => setIsSeeking(true)}
              onChangeEnd={() => setIsSeeking(false)}
              id="player-range"
            >
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          <Box width="5%" textAlign="right">
            <Text fontSize="xs">{formatTime(duration)}</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Player;
