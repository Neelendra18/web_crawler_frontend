import React, { useState } from 'react';
import DropZone from '../components/DropZone/DropZone';
import './CrawlerPage.css';

const inputOptions = [
	{ label: 'Target URL', value: 'url' },
	{ label: 'Document Upload', value: 'document' },
	{ label: 'Both', value: 'both' },
];

const tips = [
	'🔗 Provide a specific page URL for targeted test generation',
	'📄 Attach Swagger/OpenAPI docs for API test cases',
	'⚡ Shallow: Fastest, covers only top-level pages, lowest token usage.',
	'⚡ Standard: Balanced speed and coverage, recommended for most cases.',
	'⚡ Deep: Thorough, covers all nested flows, highest token usage.',
];

const CrawlPage: React.FC = () => {
	const [section, setSection] = useState<'new'|'history'>('new');
	const [inputType, setInputType] = useState<'url'|'document'|'both'>('url');
	const [url, setUrl] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [status, setStatus] = useState<'idle'|'running'|'done'>('idle');

	const handleDrop = (files: FileList) => {
		if (files.length > 0) setFile(files[0]);
	};

	return (
		<div style={{ padding: 32 }}>
			{/* Page Heading */}
			<div className="section-header" style={{ marginBottom: 32 }}>
				<div className="section-title">Crawl</div>
				<div className="section-line" />
			</div>
			{/* Two-column layout */}
			<div className="crawl-page-2col" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
				{/* Main Section */}
				<div style={{ flex: 2, minWidth: 0 }}>
					<div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
						<button className={`btn${section === 'new' ? ' btn-primary' : ''}`} onClick={() => setSection('new')}>New</button>
						<button className={`btn${section === 'history' ? ' btn-primary' : ''}`} onClick={() => setSection('history')}>History</button>
					</div>
					{section === 'new' && (
						<div className="card" style={{ padding: 32, marginBottom: 32 }}>
							<div className="input-group" style={{ marginBottom: 18 }}>
								<div className="input-label">Select Input Method</div>
								<select className="input-field" value={inputType} onChange={e => setInputType(e.target.value as 'url'|'document'|'both')}>
									{inputOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
								</select>
							</div>
							{(inputType === 'url' || inputType === 'both') && (
								<>
									<div className="input-group">
										<div className="input-label">Target URL</div>
										<input
											className="input-field"
											type="url"
											placeholder="https://yourapp.com/feature"
											value={url}
											onChange={e => setUrl(e.target.value)}
											autoComplete="off"
										/>
									</div>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
										<div className="input-group" style={{ marginBottom: 0 }}>
											<div className="input-label">Crawl Depth</div>
											<select className="input-field" defaultValue="1">
												<option value="1">1 — Shallow</option>
												<option value="2">2 — Standard</option>
												<option value="3">3 — Deep</option>
											</select>
										</div>
										<div className="input-group" style={{ marginBottom: 0 }}>
											<div className="input-label">Mode</div>
											<select className="input-field" defaultValue="Full Page">
												<option value="Full Page">Full Page</option>
												<option value="User Flow">User Flow</option>
												<option value="API Only">API Only</option>
											</select>
										</div>
									</div>
								</>
							)}
							{(inputType === 'document' || inputType === 'both') && (
								<div className="input-group">
									<div className="input-label">Upload Documents (optional)</div>
									<DropZone onDrop={handleDrop}>
										<div className="drop-zone-icon">📄</div>
										<div className="drop-zone-text">Drag & drop files or <strong>browse</strong></div>
										<div className="drop-zone-sub">PDF · XLSX · DOCX · PNG · JPG</div>
										{file && <div style={{ marginTop: 8, fontSize: 13 }}>Selected: {file.name}</div>}
									</DropZone>
								</div>
							)}
							<div className="input-group" style={{ marginTop: 18 }}>
								<button
									className="btn btn-primary"
									style={{ width: '100%', padding: '12px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
									onClick={() => setStatus('running')}
								>
									Start Crawl
								</button>
							</div>
							{status === 'running' && (
								<div className="modal-overlay open">
									<div className="modal">
										<div className="modal-title">Crawl In Progress</div>
										<div className="modal-body" style={{ textAlign: 'center', padding: 16 }}>
											<div className="status-chip running" style={{ marginBottom: 12 }}>Running</div>
											<div>Live crawl status and progress will appear here.</div>
										</div>
										<div className="modal-actions">
											<button className="btn" onClick={() => setStatus('idle')}>Close</button>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
					{section === 'history' && (
						<div className="card" style={{ padding: 32 }}>
							<div style={{ fontSize: 16, color: 'var(--text-dim)' }}>Recent crawl jobs will appear here.</div>
						</div>
					)}
				</div>
				{/* Right Panel: Tips & Advanced */}
				<div style={{ flex: 1, minWidth: 320 }}>
					<div className="card" style={{ marginBottom: 24, padding: 24 }}>
						<div className="card-title" style={{ marginBottom: 12 }}>Tips</div>
						<ul style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, paddingLeft: 18 }}>
							{tips.filter(tip => !tip.toLowerCase().includes('token usage')).map((tip, i) => <li key={i}>{tip}</li>)}
						</ul>
					</div>
					<div className="card" style={{ padding: 24 }}>
						<div className="card-title" style={{ marginBottom: 12 }}>Advanced Options</div>
						<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
								<input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />
								Include authentication flows
							</label>
							<label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
								<input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent)' }} />
								Generate negative test cases
							</label>
							<label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13 }}>
								<input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
								Screenshot each step
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CrawlPage;
