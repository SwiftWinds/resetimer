export function formatTime(seconds: number) {
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  var s = Math.floor((seconds % 3600) % 60);

  return (
    ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2)
  );
}

export function roundToNearestMinute(seconds: number) {
  return Math.round(seconds / 60) * 60;
}
