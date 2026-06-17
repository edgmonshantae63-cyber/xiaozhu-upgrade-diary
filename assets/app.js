const articles = [
  {
    id: "daily-note-recording-beats-memory",
    title: "今天的小发现：记录比记忆更可靠",
    date: "2026-06-17",
    readingTime: "3 分钟",
    tags: ["日常观察", "学习方法"],
    summary: "把灵感交给系统，而不是交给当下的兴奋感。",
    body: [
      "我以前常以为真正重要的想法会自己留下来。后来发现，最容易留下来的不是重要的想法，而是情绪最重的瞬间。",
      "记录的价值不是把生活变成档案，而是给未来的自己留一个重新进入现场的入口。哪怕只写三句话：发生了什么、我当时怎么判断、下次可以怎么做，都会比只靠记忆稳定。",
      "今天开始，我会把零散想法先放进一个固定收件箱，每周再整理一次。重要的不是格式漂亮，而是让想法有地方落脚。"
    ],
    gains: ["给想法一个固定入口", "用三句话保留现场", "每周整理一次，而不是每天苛责自己"]
  },
  {
    id: "project-review-hypothesis-first",
    title: "一次项目复盘：先写假设，再写结论",
    date: "2026-06-10",
    readingTime: "5 分钟",
    tags: ["工作方法", "复盘"],
    summary: "复盘不是证明谁对谁错，而是让下一次判断更早、更清楚。",
    body: [
      "这次项目最大的提醒，是不要在结束后才拼命解释结果。更好的方式是在开始前写下假设：我们相信什么会发生，依据是什么，如果没有发生说明哪里错了。",
      "当假设被提前写出来，团队讨论会少一点事后合理化，多一点可验证的判断。结论也会更干净，因为每个人都能看到当时的思路，而不是只看到最终输赢。",
      "我给自己留了一个小模板：目标、关键假设、验证信号、风险提醒、结束后的修正。它不复杂，但足够让复盘有抓手。"
    ],
    gains: ["项目开始前写下关键假设", "用验证信号减少模糊争论", "复盘时修正判断模型"]
  },
  {
    id: "reading-slow-down-is-not-stop",
    title: "读书笔记：慢下来不是停下来",
    date: "2026-06-02",
    readingTime: "4 分钟",
    tags: ["读书", "生活"],
    summary: "速度感有时会让人误以为自己在前进，理解才是真正的距离。",
    body: [
      "这周读书时，我意识到自己经常在追求读完，而不是读懂。读完带来的是完成感，读懂带来的才是可迁移的判断。",
      "慢下来不是降低效率，而是把注意力从页码移到问题上。作者为什么这样说？这个观点适用于哪些场景？有没有相反的例子？这些问题会让阅读从输入变成对话。",
      "以后每读完一章，我会只摘一个最想带走的问题。少一点摘抄，多一点回应。"
    ],
    gains: ["把阅读目标从数量挪到问题", "为观点补一个反例", "每章只带走一个真正有用的问题"]
  },
  {
    id: "learning-checklist-reusable",
    title: "把学到的东西变成可复用清单",
    date: "2026-05-24",
    readingTime: "6 分钟",
    tags: ["学习方法", "工具"],
    summary: "知识只有进入行动流程，才会在下一次需要时准时出现。",
    body: [
      "很多笔记之所以沉睡，是因为它们停在了概念层。真正会被再次使用的内容，往往已经被改写成清单、步骤或判断标准。",
      "我尝试把一篇学习笔记拆成三类：事实，原则，动作。事实帮助我对齐背景；原则帮助我判断；动作帮助我在下一次直接开始。",
      "这个方法特别适合技术学习、写作流程和项目复盘。只要最后能得到一张短清单，笔记就从收藏变成了工具。"
    ],
    gains: ["把笔记改写成事实、原则、动作", "用短清单承接下一次行动", "减少只收藏不使用的内容"]
  }
];

const topicDescriptions = {
  学习方法: "学习、整理、复习和迁移知识的方法。",
  工作方法: "项目推进、沟通协作和复盘中的判断。",
  读书: "读到有用观点之后留下的回应。",
  生活: "让日常更清楚、更松弛的小观察。",
  复盘: "把结果还原成可修正的过程。",
  工具: "能减少摩擦、提升稳定性的工具和流程。",
  日常观察: "从细小经验里提炼出的提醒。"
};

const state = {
  tag: "全部",
  query: ""
};

const articleGrid = document.querySelector("#articleGrid");
const tagList = document.querySelector("#tagList");
const topicGrid = document.querySelector("#topicGrid");
const searchInput = document.querySelector("#searchInput");
const dialog = document.querySelector("#articleDialog");
const closeDialogButton = document.querySelector("#closeDialog");
const dialogMeta = document.querySelector("#dialogMeta");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogTags = document.querySelector("#dialogTags");
const dialogBody = document.querySelector("#dialogBody");
const themeToggle = document.querySelector("#themeToggle");

const uniqueTags = ["全部", ...new Set(articles.flatMap((article) => article.tags))];

function formatDate(dateString) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(`${dateString}T00:00:00`));
}

function escapeHTML(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function tagMarkup(tag) {
  return `<span class="tag">${escapeHTML(tag)}</span>`;
}

function renderTags() {
  tagList.innerHTML = uniqueTags
    .map(
      (tag) => `
        <button class="tag-button${tag === state.tag ? " is-active" : ""}" type="button" data-tag="${escapeHTML(tag)}">
          ${escapeHTML(tag)}
        </button>
      `
    )
    .join("");
}

function articleMatches(article) {
  const tagMatches = state.tag === "全部" || article.tags.includes(state.tag);
  const query = state.query.trim().toLowerCase();
  if (!tagMatches) return false;
  if (!query) return true;

  const searchable = [
    article.title,
    article.summary,
    article.tags.join(" "),
    article.body.join(" ")
  ]
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function renderArticles() {
  const filtered = articles.filter(articleMatches);

  if (!filtered.length) {
    articleGrid.innerHTML = `<div class="empty-state">没有找到匹配的文章。</div>`;
    return;
  }

  articleGrid.innerHTML = filtered
    .map(
      (article) => `
        <article class="article-card">
          <p class="article-date">${formatDate(article.date)} · ${escapeHTML(article.readingTime)}</p>
          <h3>${escapeHTML(article.title)}</h3>
          <p>${escapeHTML(article.summary)}</p>
          <div class="card-tags">${article.tags.map(tagMarkup).join("")}</div>
          <button class="read-link" type="button" data-article-id="${escapeHTML(article.id)}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            阅读
          </button>
        </article>
      `
    )
    .join("");
}

function renderTopics() {
  const topicCounts = articles.reduce((counts, article) => {
    article.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, {});

  const visibleTopics = Object.entries(topicCounts).slice(0, 8);

  topicGrid.innerHTML = visibleTopics
    .map(([topic, count], index) => {
      const description = topicDescriptions[topic] || "持续补充中的记录主题。";
      const number = String(index + 1).padStart(2, "0");
      return `
        <section class="topic-card">
          <span>${number}</span>
          <h3>${escapeHTML(topic)}</h3>
          <p>${escapeHTML(description)} 当前 ${count} 篇。</p>
        </section>
      `;
    })
    .join("");

  document.querySelector("#statArticles").textContent = articles.length;
  document.querySelector("#statTopics").textContent = visibleTopics.length;
}

function openArticle(articleId) {
  const article = articles.find((item) => item.id === articleId);
  if (!article) return;

  dialogMeta.textContent = `${formatDate(article.date)} · ${article.readingTime}`;
  dialogTitle.textContent = article.title;
  dialogTags.innerHTML = article.tags.map(tagMarkup).join("");
  dialogBody.innerHTML = `
    ${article.body.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
    <h3>这次带走</h3>
    <ul>
      ${article.gains.map((gain) => `<li>${escapeHTML(gain)}</li>`).join("")}
    </ul>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }

  document.body.classList.add("dialog-open");
  history.replaceState(null, "", `#${article.id}`);
}

function closeArticle() {
  dialog.close();
  document.body.classList.remove("dialog-open");
  if (location.hash) {
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("preferred-theme", theme);
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("preferred-theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  applyTheme(savedTheme || systemTheme);
}

tagList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tag]");
  if (!button) return;
  state.tag = button.dataset.tag;
  renderTags();
  renderArticles();
});

articleGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-article-id]");
  if (!button) return;
  openArticle(button.dataset.articleId);
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderArticles();
});

closeDialogButton.addEventListener("click", closeArticle);

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    closeArticle();
  }
});

dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  if (location.hash && articles.some((article) => `#${article.id}` === location.hash)) {
    history.replaceState(null, "", `${location.pathname}${location.search}`);
  }
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

initializeTheme();
renderTags();
renderArticles();
renderTopics();

const articleFromHash = location.hash.replace("#", "");
if (articleFromHash && articles.some((article) => article.id === articleFromHash)) {
  openArticle(articleFromHash);
}
