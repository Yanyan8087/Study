import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  projectId: "study-94c9b",
  appId: "1:465188394813:web:2e02b6653ae3ff56b91754",
  storageBucket: "study-94c9b.firebasestorage.app",
  apiKey: "AIzaSyA6GLFRKByPfD_k8n5pBSJV528vzBFeCRY",
  authDomain: "study-94c9b.firebaseapp.com",
  messagingSenderId: "465188394813"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const wordsRef = collection(db, "wordcloud_words");

const form = document.querySelector("#wordForm");
const input = document.querySelector("#wordInput");
const cloud = document.querySelector("#cloud");
const emptyState = document.querySelector("#emptyState");
const connectionState = document.querySelector("#connectionState");
const totalCount = document.querySelector("#totalCount");
const uniqueCount = document.querySelector("#uniqueCount");
const topWord = document.querySelector("#topWord");
const lockButton = document.querySelector("#lockButton");
const exportButton = document.querySelector("#exportButton");
const clearButton = document.querySelector("#clearButton");

let locked = false;
let currentRows = [];

function cleanWord(value) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 24);
}

async function submitWord(value) {
  const word = cleanWord(value);
  if (!word || locked) return;

  input.value = "";
  await addDoc(wordsRef, {
    text: word,
    normalized: word.toLocaleLowerCase(),
    createdAt: serverTimestamp(),
    source: "class-word-cloud"
  });
}

function aggregate(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.normalized || row.text.toLocaleLowerCase();
    const item = map.get(key) || { text: row.text, count: 0 };
    item.count += 1;
    map.set(key, item);
  }

  return [...map.values()].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return a.text.localeCompare(b.text, "zh-Hant");
  });
}

function render(rows) {
  currentRows = rows;
  const words = aggregate(rows);
  const maxCount = Math.max(...words.map((item) => item.count), 1);

  totalCount.textContent = rows.length.toString();
  uniqueCount.textContent = words.length.toString();
  topWord.textContent = words[0] ? words[0].text : "-";
  emptyState.classList.toggle("hidden", words.length > 0);
  cloud.replaceChildren();

  words.slice(0, 80).forEach((item, index) => {
    const chip = document.createElement("span");
    const weight = item.count / maxCount;
    const size = 20 + Math.round(weight * 70);
    const angle = index % 7 === 0 ? "-5deg" : index % 5 === 0 ? "4deg" : "0deg";
    chip.className = "word-chip";
    chip.style.fontSize = `${size}px`;
    chip.style.setProperty("--angle", angle);
    chip.textContent = item.count > 1 ? `${item.text} ${item.count}` : item.text;
    cloud.append(chip);
  });
}

function downloadCsv() {
  const header = "text,createdAt,source\n";
  const body = currentRows
    .map((row) => [
      `"${String(row.text || "").replaceAll('"', '""')}"`,
      `"${String(row.createdAt || "").replaceAll('"', '""')}"`,
      `"${String(row.source || "").replaceAll('"', '""')}"`
    ].join(","))
    .join("\n");

  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `wordcloud-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

async function clearWords() {
  const ok = window.confirm("清空目前所有文字？");
  if (!ok) return;

  const snapshot = await getDocs(wordsRef);
  await Promise.all(snapshot.docs.map((item) => deleteDoc(doc(db, "wordcloud_words", item.id))));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await submitWord(input.value);
  } catch (error) {
    window.alert(`送出失败：${error.message}`);
  }
});

document.querySelectorAll("[data-word]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.word;
    input.focus();
  });
});

lockButton.addEventListener("click", () => {
  locked = !locked;
  input.disabled = locked;
  form.querySelector("button").disabled = locked;
  lockButton.textContent = locked ? "解除锁定" : "锁定提交";
  lockButton.classList.toggle("locked", locked);
});

exportButton.addEventListener("click", downloadCsv);
clearButton.addEventListener("click", clearWords);

const wordsQuery = query(wordsRef, orderBy("createdAt", "desc"));
onSnapshot(
  wordsQuery,
  (snapshot) => {
    connectionState.textContent = "在线";
    connectionState.classList.remove("offline");
    render(snapshot.docs.map((item) => {
      const data = item.data();
      return {
        id: item.id,
        text: data.text || "",
        normalized: data.normalized || "",
        source: data.source || "",
        createdAt: data.createdAt?.toDate?.().toISOString?.() || ""
      };
    }));
  },
  (error) => {
    connectionState.textContent = "离线";
    connectionState.classList.add("offline");
    window.alert(`连接失败：${error.message}`);
  }
);
