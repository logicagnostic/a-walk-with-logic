(function () {
  var url = window.AUDIO_PLAYS_URL;
  if (!url) return;

  var players = document.querySelectorAll("audio");

  function send(post, milestone, where) {
    try {
      fetch(url, {
        method: "POST",
        mode: "no-cors",
        keepalive: true,
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ post: post, milestone: milestone, where: where })
      }).catch(function () {});
    } catch (err) {}
  }

  Array.prototype.forEach.call(players, function (audio) {
    var src = audio.getAttribute("src") || "";
    var post = src.split("/").pop().split("?")[0];
    if (!post) return;

    var where = audio.closest(".homepage-featured, .homepage-latest") ? "home page" : "post page";
    var sent = {};

    function mark(milestone) {
      if (sent[milestone]) return;
      sent[milestone] = true;
      send(post, milestone, where);
    }

    audio.addEventListener("play", function () {
      mark("play");
    });

    audio.addEventListener("timeupdate", function () {
      if (!audio.duration || !isFinite(audio.duration)) return;
      var percent = (audio.currentTime / audio.duration) * 100;
      if (percent >= 25) mark("25");
      if (percent >= 50) mark("50");
      if (percent >= 75) mark("75");
    });

    audio.addEventListener("ended", function () {
      mark("25");
      mark("50");
      mark("75");
      mark("finished");
    });
  });
})();
