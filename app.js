// 1. Initialize Supabase Client
// Replace these with your actual Supabase URL and Anon Key
const SUPABASE_URL = 'https://cjkbuckqiyxtoaytlhzw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqa2J1Y2txaXl4dG9heXRsaHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODc4MjMsImV4cCI6MjA5NDE2MzgyM30.CVYDQm9EYunFmIF1MsFn5vSd9-YU1XTemnfGY8sF-Yo';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsTitle = document.getElementById('resultsTitle');

// 3. Search Functionality
async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;

    // Show loading UI
    loadingIndicator.classList.remove('hidden');
    resultsContainer.innerHTML = '';
    resultsTitle.innerText = `Searching for: "${query}"`;

    try {
        // Direct call to Supabase PostgreSQL Full-Text Search
        const { data, error } = await supabase
            .from('judgments')
            .select('id, title, citation, court, judgment_date, pdf_path')
            .textSearch('fts', query, {
                type: 'websearch',
                config: 'english'
            })
            .limit(20);

        if (error) throw error;

        renderResults(data);
    } catch (err) {
        console.error("Search Error:", err);
        resultsContainer.innerHTML = `<div class="p-5 text-red-500">Error executing search: ${err.message}</div>`;
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}

// 4. Render UI
function renderResults(results) {
    if (!results || results.length === 0) {
        resultsContainer.innerHTML = `<div class="p-8 text-center text-gray-500">No judgments found matching your query.</div>`;
        return;
    }

    let html = '';
    results.forEach(item => {
        // Generate public URL for PDF download
        const { data: pdfData } = supabase.storage.from('pdfs').getPublicUrl(item.pdf_path);
        const pdfUrl = pdfData.publicUrl;

        html += `
        <div class="p-5 border-b border-gray-100 hover:bg-gray-50 transition">
            <div class="flex justify-between items-start mb-2">
                <h4 class="font-bold text-lg text-blue-700">${item.title}</h4>
                <span class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded font-medium border border-gray-200">${item.court || 'Court'}</span>
            </div>
            <p class="text-sm text-gray-600 mb-3">Citation: ${item.citation || 'N/A'} | Date: ${item.judgment_date || 'N/A'}</p>
            <div class="flex gap-3 mt-3">
                <a href="${pdfUrl}" target="_blank" class="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1">
                    <i class="fas fa-file-pdf"></i> View PDF
                </a>
            </div>
        </div>`;
    });

    resultsContainer.innerHTML = html;
}

// 5. Event Listeners
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});
