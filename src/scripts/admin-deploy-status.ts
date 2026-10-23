const STATUS_LABELS: Record<string, string> = {
  success: "成功",
  failure: "失败",
  cancelled: "已取消",
  skipped: "已跳过",
  in_progress: "进行中",
  queued: "排队中",
};

function formatTime(value: string): string {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

async function updateDeployStatus(): Promise<void> {
  const element = document.querySelector<HTMLElement>("[data-deploy-status]");
  if (!element || element.dataset.bound === "true") return;
  element.dataset.bound = "true";
  const repoUrl = element.dataset.repo ?? "";
  const match = /github\.com\/([^/]+)\/([^/]+)/.exec(repoUrl);
  if (!match) {
    element.textContent = "最近部署：查看 Actions";
    return;
  }
  const [, owner, repo] = match;

  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/deploy.yml/runs?per_page=1&branch=main`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) throw new Error("GitHub API " + response.status);
    const data = (await response.json()) as {
      workflow_runs?: {
        status: string;
        conclusion: string | null;
        created_at: string;
        html_url: string;
      }[];
    };
    const run = data.workflow_runs?.[0];
    if (!run) {
      element.textContent = "最近部署：暂无运行记录";
      return;
    }
    const status = run.conclusion ?? run.status;
    element.dataset.state = status;
    element.textContent = `最近部署：${STATUS_LABELS[status] ?? status} · ${formatTime(run.created_at)}`;
  } catch {
    element.textContent = "最近部署：查看 Actions（API 暂不可用）";
  }
}

document.addEventListener("astro:page-load", () => void updateDeployStatus());
void updateDeployStatus();
