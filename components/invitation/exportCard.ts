export async function exportInvitationCard(element: HTMLElement) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const { default: html2canvas } = await import("html2canvas");
  const canvas = await html2canvas(element, {
    backgroundColor: "#f7f3eb",
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png", 1);
  });

  if (!blob) {
    throw new Error("Unable to create the invitation image.");
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = "birthday-evening-invitation.png";
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
