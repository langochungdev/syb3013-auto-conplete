// content.js
(async function () {
  try {
    // ánh xạ courseId với danh sách lectureIds
    const lectureMap = {
      "5928696": [
        "43351934","43352732","43352030","43352608","43353038","43353168",
        "43353426","43353560","43353642","43353718","43353760","43353798",
        "43353926","43353974","43354000","43354020","43354056","43354074","43354094"
      ],
      "662354": [
        "3971352","6178342","4407694","14189311","3993424","3993426","3993428",
        "3993430","4018548","4070218","4044292","3993432","3993434","3993436",
        "3993438","3993440","4069232","4044294","3993442","3993448","3993446",
        "3993450","3993452","4044296","3993458","3993464","3993468","3993470",
        "3993472","3993474","4044298","4005142","4005144","4005146","4005148",
        "4005152","4005154","4044300","4018536","4018538","4018540","4018544",
        "4018542","4033696","4588354","4630650","4044302","3971360","3971362",
        "3971364","4044304","3971378","4005184","4531506","3971384","4044306",
        "3993592","3971396","3971398","4176000","3971654","4176002","3971408",
        "4531514","3971414","3971416","4044308","3971424","3971426","3971430",
        "3971436","3971438","3971442","3971444","4044310","3971448","3971450",
        "3971452","3971454","3971456","3971458","3971460","3971462","3971464",
        "4044312","15983418","3971470","3971472","3971474","4044314","11422634"
      ]
    };

    // lấy courseSlug từ URL
    const url = window.location.href;
    const slugMatch = url.match(/udemy\.com\/course\/([^/]+)/);
    if (!slugMatch) return console.log("Không tìm thấy courseSlug");
    const courseSlug = slugMatch[1];

    // lấy courseId
    const res = await fetch(
      `https://fpl.udemy.com/api-2.0/courses/${courseSlug}/?fields[course]=id`,
      { credentials: "include" }
    );
    if (!res.ok) return console.error("Không lấy được courseId");
    const data = await res.json();
    const courseId = data.id;

    const lectureIds = lectureMap[courseId];
    if (!lectureIds) {
      return console.error(`CourseId ${courseId} chưa được định nghĩa trong lectureMap`);
    }

    // tạo progress bar
    const bar = document.createElement("div");
    bar.style.position = "fixed";
    bar.style.top = "0";
    bar.style.left = "0";
    bar.style.width = "0%";
    bar.style.height = "5px";
    bar.style.background = "green";
    bar.style.zIndex = "99999";
    document.body.appendChild(bar);

    // chạy post hoàn thành lecture
    for (let i = 0; i < lectureIds.length; i++) {
      const lectureId = lectureIds[i];
      const done = await fetch(
        `https://fpl.udemy.com/api-2.0/users/me/subscribed-courses/${courseId}/completed-lectures/`,
        {
          method: "POST",
          headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest"
          },
          body: JSON.stringify({ lecture_id: lectureId, downloaded: false }),
          credentials: "include"
        }
      );

      if (done.status === 201) {
        console.log(`Lecture ${lectureId} đã đánh dấu hoàn thành.`);
      } else {
        console.error(`Lỗi với lecture ${lectureId}:`, done.status);
      }
      bar.style.width = ((i + 1) / lectureIds.length * 100) + "%";
      await new Promise(r => setTimeout(r, 500));
    }

    alert("Đã hoàn thành đánh dấu tất cả lecture!");
    bar.style.background = "blue";
    location.reload();
  } catch (e) {
    console.error("Lỗi script:", e);
  }
})();
