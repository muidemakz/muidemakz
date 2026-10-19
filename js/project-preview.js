(function () {
  'use strict';

  function resolvePreview(projects, search) {
    const slug = new URLSearchParams(search).get('project');
    if (!slug) return null;
    return projects.find(project => project.status === 'coming-soon' && project.slug === slug) || null;
  }

  function previewMetadata(project) {
    // confirmed:false entries retain their catalogue data, but their tentative
    // dates/categories are not promoted into new case-study assertions.
    if (project.confirmed !== true) return [];
    return [project.year, ...(project.categories || [])].filter(Boolean).map(String);
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { resolvePreview, previewMetadata };
  if (typeof document === 'undefined') return;

  const project = resolvePreview(typeof PROJECTS === 'undefined' ? [] : PROJECTS, window.location.search);
  const title = document.getElementById('previewTitle');
  const summary = document.getElementById('previewSummary');
  const cover = document.getElementById('previewCover');
  const statusTitle = document.getElementById('previewStatusTitle');
  const statusCopy = document.getElementById('previewStatusCopy');
  if (!title || !summary || !cover || !statusTitle || !statusCopy) return;

  if (!project) {
    document.title = 'Project Preview Not Found · Excellent Makanju';
    title.textContent = 'Project preview not found';
    summary.textContent = 'Choose a project from Work to see its preview.';
    statusTitle.textContent = 'Back to the work.';
    statusCopy.textContent = 'This preview link isn’t available. Browse the project collection to find available case studies and upcoming previews.';
    document.getElementById('previewContact').textContent = 'Get in touch';
    return;
  }

  const details = project.preview || {};
  document.querySelector('.case-kicker').textContent = 'Case study coming soon';
  document.title = project.name + ' · Case Study Coming Soon · Excellent Makanju';
  title.textContent = project.name;
  summary.textContent = details.summary || 'The full case study isn’t available yet.';
  const meta = document.getElementById('previewMeta');
  const metadata = previewMetadata(project);
  metadata.forEach(text => {
    const item = document.createElement('li'); item.textContent = text; meta.appendChild(item);
  });
  meta.hidden = !metadata.length;

  document.getElementById('previewBrand').textContent = project.brand || project.name;
  const mediaSource = details.image || project.image;
  const videoSource = details.video;
  if (mediaSource || videoSource) {
    const media = document.createElement(videoSource ? 'video' : 'img');
    media.src = videoSource || mediaSource;
    if (videoSource) { media.controls = true; media.playsInline = true; media.preload = 'metadata'; if (mediaSource) media.poster = mediaSource; }
    else media.alt = details.imageAlt || project.name + ' project preview';
    media.addEventListener('error', () => { media.remove(); document.getElementById('previewArtwork').hidden = false; document.getElementById('previewCoverCaption').textContent = 'Preview artwork is unavailable. The project links below are still available.'; });
    document.getElementById('previewArtwork').hidden = true;
    cover.insertBefore(media, cover.firstChild);
    document.getElementById('previewCoverCaption').textContent = details.mediaCaption || project.name + ' · Project preview';
  }
  cover.hidden = false;

  const scope = Array.isArray(details.scope) ? details.scope.filter(item => typeof item === 'string' && item.trim()) : [];
  if (details.role) {
    document.getElementById('previewRole').textContent = details.role;
    document.getElementById('previewRoleRow').hidden = false;
  }
  scope.forEach(text => { const item = document.createElement('li'); item.textContent = text; document.getElementById('previewScope').appendChild(item); });
  document.getElementById('previewScopeRow').hidden = !scope.length;
  document.getElementById('previewFacts').hidden = !details.role && !scope.length;
  document.getElementById('previewContact').href = 'mailto:muidemakz@gmail.com?subject=' + encodeURIComponent('Portfolio project: ' + project.name);
})();
