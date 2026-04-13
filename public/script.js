async function uploadVideo() {
  const fileInput = document.getElementById("videoInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Select video first!");
    return;
  }

  const formData = new FormData();
  formData.append("video", file);

  await fetch("/upload", {
    method: "POST",
    body: formData
  });

  fileInput.value = "";
  loadVideos();
}

// load videos
async function loadVideos() {
  const res = await fetch("/videos-list");
  const videos = await res.json();

  const container = document.getElementById("videos");
  container.innerHTML = "";

  videos.reverse().forEach(video => {
    const card = document.createElement("div");
    card.className = "card";

    // video
    const videoEl = document.createElement("video");
    videoEl.src = `/videos/${video}`;
    videoEl.controls = true;

    // like
    const likeBtn = document.createElement("button");
    likeBtn.innerText = "❤️ Like";
    likeBtn.className = "like";
    likeBtn.onclick = () => {
      likeBtn.innerText = "❤️ Liked";
    };

    // share
    const shareBtn = document.createElement("button");
    shareBtn.innerText = "🔗 Share";
    shareBtn.className = "share";
    shareBtn.onclick = () => {
      const link = window.location.origin + "/videos/" + video;
      navigator.clipboard.writeText(link);
      alert("Link copied!");
    };

    // download
    const downloadBtn = document.createElement("a");
    downloadBtn.innerText = "⬇ Save";
    downloadBtn.href = `/videos/${video}`;
    downloadBtn.download = video;
    downloadBtn.className = "download";

    const controls = document.createElement("div");
    controls.className = "controls";

    controls.appendChild(likeBtn);
    controls.appendChild(shareBtn);
    controls.appendChild(downloadBtn);

    card.appendChild(videoEl);
    card.appendChild(controls);

    container.appendChild(card);
  });
}

// auto load
loadVideos();
