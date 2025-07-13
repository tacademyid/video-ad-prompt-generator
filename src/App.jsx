import React, { useState } from 'react';

// Main App component
const App = () => {
    // State variables for form inputs
    const [adTitle, setAdTitle] = useState('');
    const [brandName, setBrandName] = useState('');
    const [adTheme, setAdTheme] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [mainCharacterDescription, setMainCharacterDescription] = useState('');
    const [locationDescription, setLocationDescription] = useState('');
    const [tone, setTone] = useState('inspiring');
    const [visualStyle, setVisualStyle] = useState('');
    const [dialogueNarration, setDialogueNarration] = useState('');
    const [callToAction, setCallToAction] = useState('');
    const [spokenLanguage, setSpokenLanguage] = useState('Bahasa Indonesia');
    const [additionalInstructions, setAdditionalInstructions] = useState('');
    const [length, setLength] = useState('30s');

    // State to store the generated output (info and scenes)
    const [generatedOutput, setGeneratedOutput] = useState({ info: '', scenes: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState({}); // State for copy success message per scene

    // State to manage active tab for each scene
    const [activeSceneTab, setActiveSceneTab] = useState({}); // { sceneIndex: 'id' | 'en' }

    // Function to handle prompt generation
    const generatePrompt = async () => {
        setError(''); // Clear previous errors
        setIsLoading(true); // Show loading indicator
        setGeneratedOutput({ info: '', scenes: [] }); // Clear previous prompts
        setCopySuccess({}); // Clear all copy messages

        // Basic validation for essential fields
        if (!adTitle || !brandName || !targetAudience || !callToAction) {
            setError('Harap isi semua bidang yang wajib diisi (Judul Iklan, Nama Brand/Produk, Target Audiens, Call to Action).');
            setIsLoading(false);
            return;
        }

        // Construct the prompt for the LLM with all new fields, asking for 5 distinct scenes in both languages
        const promptText = `
            Buat prompt video iklan yang kreatif dan menarik berdasarkan detail berikut. Respons Anda harus dimulai dengan ringkasan informasi umum iklan, diikuti oleh 5 prompt terpisah untuk text-to-video, masing-masing menggambarkan adegan yang berbeda (Adegan 1 hingga Adegan 5).

            Judul Iklan: ${adTitle}
            Nama Brand / Produk: ${brandName}
            Tema Iklan: ${adTheme || 'Tidak ditentukan'}
            Target Audiens: ${targetAudience}
            Deskripsi Karakter Utama: ${mainCharacterDescription || 'Tidak ditentukan'}
            Deskripsi Lokasi: ${locationDescription || 'Tidak ditentukan'}
            Nada & Suasana: ${tone}
            Gaya Visual: ${visualStyle || 'Tidak ditentukan'}
            Call to Action: ${callToAction}
            Bahasa Lisan: ${spokenLanguage}
            Perkiraan Durasi: ${length}
            Petunjuk Tambahan: ${additionalInstructions || 'Tidak ada'}

            ${dialogueNarration ? `Gunakan dialog/narasi utama ini sebagai inspirasi atau tema: "${dialogueNarration}".` : 'Buat dialog/narasi yang relevan untuk setiap adegan.'}

            Format respons Anda harus sebagai berikut:

            Informasi Umum Iklan:
            - Judul Iklan: [Judul Iklan]
            - Brand/Produk: [Nama Brand / Produk]
            - Tema: [Tema Iklan]
            - Audiens: [Target Audiens]
            - Pesan Utama: [Call to Action]
            - Nada & Suasana: [Tone & Mood]
            - Gaya Visual: [Gaya Visual]
            - Bahasa: [Spoken Language]
            - Durasi: [Perkiraan Durasi]
            - Petunjuk: [Petunjuk Tambahan]
            - Ringkasan Singkat: [Ringkasan singkat keseluruhan iklan berdasarkan input di atas.]

            Adegan 1:
            Deskripsi Adegan (Bahasa Indonesia): [Deskripsi visual yang detail untuk adegan ini, **mengintegrasikan deskripsi karakter utama secara langsung** jika ada karakter utama yang relevan.]
            Aksi Karakter (Bahasa Indonesia): [Aksi spesifik karakter utama, menggunakan deskripsi yang diberikan: ${mainCharacterDescription || 'Tidak ada karakter utama spesifik.'}]
            Dialog/Narasi (Bahasa Indonesia): [Dialog atau narasi yang dihasilkan AI untuk adegan ini, berdasarkan masukan atau dibuat relevan.]
            Audio/Musik (Bahasa Indonesia): [Saran audio/musik untuk adegan ini.]

            Scene 1:
            Scene Description (English): [Detailed visual description for this scene, **directly integrating the main character description** if a main character is relevant.]
            Character Action (English): [Specific actions of the main character, using the provided description: ${mainCharacterDescription || 'No specific main character.'}]
            Dialogue/Narration (English): [AI-generated dialogue or narration for this scene, based on input or made relevant.]
            Audio/Music (English): [Suggested audio/music for this scene.]

            Adegan 2:
            Deskripsi Adegan (Bahasa Indonesia): [Deskripsi visual yang detail untuk adegan ini, **mengintegrasikan deskripsi karakter utama secara langsung** jika ada karakter utama yang relevan.]
            Aksi Karakter (Bahasa Indonesia): [Aksi spesifik karakter utama, menggunakan deskripsi yang diberikan: ${mainCharacterDescription || 'Tidak ada karakter utama spesifik.'}]
            Dialog/Narasi (Bahasa Indonesia): [Dialog atau narasi yang dihasilkan AI untuk adegan ini, berdasarkan masukan atau dibuat relevan.]
            Audio/Musik (Bahasa Indonesia): [Saran audio/musik untuk adegan ini.]

            Scene 2:
            Scene Description (English): [Detailed visual description for this scene, **directly integrating the main character description** if a main character is relevant.]
            Character Action (English): [Specific actions of the main character, using the provided description: ${mainCharacterDescription || 'No specific main character.'}]
            Dialogue/Narration (English): [AI-generated dialogue or narration for this scene, based on input or made relevant.]
            Audio/Music (English): [Suggested audio/music for this scene.]

            Adegan 3:
            Deskripsi Adegan (Bahasa Indonesia): [Deskripsi visual yang detail untuk adegan ini, **mengintegrasikan deskripsi karakter utama secara langsung** jika ada karakter utama yang relevan.]
            Aksi Karakter (Bahasa Indonesia): [Aksi spesifik karakter utama, menggunakan deskripsi yang diberikan: ${mainCharacterDescription || 'Tidak ada karakter utama spesifik.'}]
            Dialog/Narasi (Bahasa Indonesia): [Dialog atau narasi yang dihasilkan AI untuk adegan ini, berdasarkan masukan atau dibuat relevan.]
            Audio/Musik (Bahasa Indonesia): [Saran audio/musik untuk adegan ini.]

            Scene 3:
            Scene Description (English): [Detailed visual description for this scene, **directly integrating the main character description** if a main character is relevant.]
            Character Action (English): [Specific actions of the main character, using the provided description: ${mainCharacterDescription || 'No specific main character.'}]
            Dialogue/Narration (English): [AI-generated dialogue or narration for this scene, based on input or made relevant.]
            Audio/Music (English): [Suggested audio/music for this scene.]

            Adegan 4:
            Deskripsi Adegan (Bahasa Indonesia): [Deskripsi visual yang detail untuk adegan ini, **mengintegrasikan deskripsi karakter utama secara langsung** jika ada karakter utama yang relevan.]
            Aksi Karakter (Bahasa Indonesia): [Aksi spesifik karakter utama, menggunakan deskripsi yang diberikan: ${mainCharacterDescription || 'Tidak ada karakter utama spesifik.'}]
            Dialog/Narasi (Bahasa Indonesia): [Dialog atau narasi yang dihasilkan AI untuk adegan ini, berdasarkan masukan atau dibuat relevan.]
            Audio/Musik (Bahasa Indonesia): [Saran audio/musik untuk adegan ini.]

            Scene 4:
            Scene Description (English): [Detailed visual description for this scene, **directly integrating the main character description** if a main character is relevant.]
            Character Action (English): [Specific actions of the main character, using the provided description: ${mainCharacterDescription || 'No specific main character.'}]
            Dialogue/Narasi (English): [AI-generated dialogue or narration for this scene, based on input or made relevant.]
            Audio/Music (English): [Suggested audio/music for this scene.]

            Adegan 5:
            Deskripsi Adegan (Bahasa Indonesia): [Deskripsi visual yang detail untuk adegan ini, **mengintegrasikan deskripsi karakter utama secara langsung** jika ada karakter utama yang relevan.]
            Aksi Karakter (Bahasa Indonesia): [Aksi spesifik karakter utama, menggunakan deskripsi yang diberikan: ${mainCharacterDescription || 'Tidak ada karakter utama spesifik.'}]
            Dialog/Narasi (Bahasa Indonesia): [Dialog atau narasi yang dihasilkan AI untuk adegan ini, berdasarkan masukan atau dibuat relevan.]
            Audio/Musik (Bahasa Indonesia): [Saran audio/musik untuk adegan ini.]

            Scene 5:
            Scene Description (English): [Detailed visual description for this scene, **directly integrating the main character description** if a main character is relevant.]
            Character Action (English): [Specific actions of the main character, using the provided description: ${mainCharacterDescription || 'No specific main character.'}]
            Dialogue/Narration (English): [AI-generated dialogue or narration for this scene, based on input or made relevant.]
            Audio/Music (English): [Suggested audio/music for this scene.]
        `;

        try {
            // Prepare the payload for the Gemini API
            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: promptText }] });
            const payload = { contents: chatHistory };

            // API Key is handled by the Canvas environment for gemini-2.0-flash
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            // Make the API call
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            // Check if the response structure is valid
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                let info = '';
                let scenes = [];
                let initialActiveTabs = {};

                // Extract "Informasi Umum Iklan" section
                const infoMatch = text.match(/Informasi Umum Iklan:\n([\s\S]*?)(?=Adegan 1:|$)/);
                if (infoMatch && infoMatch[1]) {
                    info = infoMatch[1].trim();
                }

                // Extract scenes starting from "Adegan 1:"
                const scenesStartIndex = text.indexOf('Adegan 1:');
                if (scenesStartIndex !== -1) {
                    const scenesText = text.substring(scenesStartIndex);
                    const rawScenes = scenesText.split(/Adegan \d+:|Scene \d+:/).filter(s => s.trim() !== '');

                    for (let i = 0; i < rawScenes.length; i += 2) { // Process pairs of ID and EN scenes
                        const idContent = rawScenes[i] ? rawScenes[i].trim() : '';
                        const enContent = rawScenes[i + 1] ? rawScenes[i + 1].trim() : '';

                        scenes.push({
                            indonesian: idContent,
                            english: enContent
                        });
                        initialActiveTabs[scenes.length - 1] = 'id'; // Default to Indonesian
                    }
                }

                setGeneratedOutput({ info, scenes });
                setActiveSceneTab(initialActiveTabs);

            } else {
                setError('Gagal menghasilkan prompt. Respon API tidak terduga.');
                console.error('Unexpected API response:', result);
            }
        } catch (err) {
            setError('Terjadi kesalahan saat menghubungi API. Silakan coba lagi.');
            console.error('API call error:', err);
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    // Function to handle copying a specific scene prompt to clipboard
    const copyScenePromptToClipboard = (sceneContent, sceneIndex) => {
        const currentLang = activeSceneTab[sceneIndex] || 'id';
        const contentToCopy = currentLang === 'id' ? sceneContent.indonesian : sceneContent.english;

        try {
            const textarea = document.createElement('textarea');
            textarea.value = contentToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            setCopySuccess(prev => ({ ...prev, [sceneIndex]: 'Prompt berhasil disalin!' }));
            setTimeout(() => setCopySuccess(prev => ({ ...prev, [sceneIndex]: '' })), 3000); // Clear message after 3 seconds
        } catch (err) {
            console.error('Failed to copy prompt: ', err);
            setError('Gagal menyalin prompt.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 sm:p-8 flex items-center justify-center font-sans">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">
                    Generator Prompt Video Iklan
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Isi detail di bawah ini untuk menghasilkan 5 prompt video iklan adegan per adegan.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Judul Iklan */}
                    <div>
                        <label htmlFor="adTitle" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Judul Iklan: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="adTitle"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Contoh: 'FokusPro: Kuasai Harimu!'"
                            value={adTitle}
                            onChange={(e) => setAdTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* Nama Brand / Produk */}
                    <div>
                        <label htmlFor="brandName" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Nama Brand / Produk: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="brandName"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Contoh: Aplikasi Produktivitas 'FokusPro'"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Tema Iklan */}
                    <div>
                        <label htmlFor="adTheme" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Tema Iklan:
                        </label>
                        <input
                            type="text"
                            id="adTheme"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Contoh: Produktivitas, Keseimbangan Hidup, Efisiensi"
                            value={adTheme}
                            onChange={(e) => setAdTheme(e.target.value)}
                        />
                    </div>

                    {/* Target Audiens */}
                    <div>
                        <label htmlFor="targetAudience" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Target Audiens: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="targetAudience"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Contoh: Profesional muda yang sibuk, mahasiswa"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            required
                        />
                    </div>

                    {/* Deskripsi Karakter Utama */}
                    <div className="md:col-span-2">
                        <label htmlFor="mainCharacterDescription" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Deskripsi Karakter Utama:
                        </label>
                        <textarea
                            id="mainCharacterDescription"
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y"
                            placeholder="Contoh: Seorang wanita muda yang terlihat stres dengan tumpukan pekerjaan, kemudian berubah menjadi lebih tenang dan produktif."
                            value={mainCharacterDescription}
                            onChange={(e) => setMainCharacterDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Deskripsi Lokasi */}
                    <div className="md:col-span-2">
                        <label htmlFor="locationDescription" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Deskripsi Lokasi:
                        </label>
                        <textarea
                            id="locationDescription"
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y"
                            placeholder="Contoh: Kantor modern yang sibuk, kafe yang tenang, rumah yang nyaman"
                            value={locationDescription}
                            onChange={(e) => setLocationDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Tone & Mood Selection */}
                    <div>
                        <label htmlFor="tone" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Tone & Mood:
                        </label>
                        <select
                            id="tone"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                        >
                            <option value="inspiring">Menginspirasi</option>
                            <option value="humorous">Humoris</option>
                            <option value="serious">Serius/Informatif</option>
                            <option value="emotional">Emosional</option>
                            <option value="upbeat">Ceria/Enerjik</option>
                            <option value="luxurious">Mewah</option>
                            <option value="friendly">Ramah</option>
                        </select>
                    </div>

                    {/* Gaya Visual */}
                    <div>
                        <label htmlFor="visualStyle" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Gaya Visual:
                        </label>
                        <input
                            type="text"
                            id="visualStyle"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Contoh: Bersih, minimalis, cerah, dinamis"
                            value={visualStyle}
                            onChange={(e) => setVisualStyle(e.target.value)}
                        />
                    </div>

                    {/* Dialog / Narasi Utama */}
                    <div className="md:col-span-2">
                        <label htmlFor="dialogueNarration" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Dialog / Narasi Utama:
                        </label>
                        <textarea
                            id="dialogueNarration"
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y"
                            placeholder="Contoh: 'Waktu adalah aset berharga. FokusPro membantu Anda mengelolanya.' (Ini akan menjadi inspirasi untuk dialog per adegan)"
                            value={dialogueNarration}
                            onChange={(e) => setDialogueNarration(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Call to Action */}
                    <div className="md:col-span-2">
                        <label htmlFor="callToAction" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Call to Action: <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="callToAction"
                            rows="2"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y"
                            placeholder="Contoh: Kunjungi website kami sekarang! Unduh aplikasi di App Store dan Google Play!"
                            value={callToAction}
                            onChange={(e) => setCallToAction(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {/* Spoken Language */}
                    <div>
                        <label htmlFor="spokenLanguage" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Spoken Language:
                        </label>
                        <input
                            type="text"
                            id="spokenLanguage"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Contoh: Bahasa Indonesia, Bahasa Inggris"
                            value={spokenLanguage}
                            onChange={(e) => setSpokenLanguage(e.target.value)}
                        />
                    </div>

                    {/* Durasi (Keeping this as it's useful) */}
                    <div>
                        <label htmlFor="length" className="block text-gray-700 text-sm font-semibold mb-2">
                            Durasi:
                        </label>
                        <select
                            id="length"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                        >
                            <option value="15s">15 detik</option>
                            <option value="30s">30 detik</option>
                            <option value="60s">60 detik</option>
                            <option value="90s">90 detik</option>
                        </select>
                    </div>

                    {/* Petunjuk Tambahan */}
                    <div className="md:col-span-2">
                        <label htmlFor="additionalInstructions" className="block text-gray-700 text-sm font-semibold mb-2">
                            🎯 Petunjuk Tambahan:
                        </label>
                        <textarea
                            id="additionalInstructions"
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-y"
                            placeholder="Contoh: Pastikan ada logo brand di akhir video. Gunakan musik latar yang menenangkan."
                            value={additionalInstructions}
                            onChange={(e) => setAdditionalInstructions(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}

                {/* Generate Button */}
                <button
                    onClick={generatePrompt}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Menghasilkan...
                        </>
                    ) : (
                        'Hasilkan Prompt Video Iklan'
                    )}
                </button>

                {/* Generated Prompt Display */}
                {generatedOutput.info && (
                    <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Informasi Umum Iklan:</h2>
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {generatedOutput.info}
                        </div>
                    </div>
                )}

                {generatedOutput.scenes.length > 0 && (
                    <div className="mt-4 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Prompt Video Iklan Anda (Adegan per Adegan):</h2>

                        {generatedOutput.scenes.map((scene, index) => (
                            <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">Adegan {index + 1}:</h3>
                                {/* Language Tabs */}
                                <div className="flex border-b border-gray-200 mb-4">
                                    <button
                                        className={`px-4 py-2 text-sm font-medium ${activeSceneTab[index] === 'id' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        onClick={() => setActiveSceneTab(prev => ({ ...prev, [index]: 'id' }))}
                                    >
                                        Bahasa Indonesia
                                    </button>
                                    <button
                                        className={`px-4 py-2 text-sm font-medium ${activeSceneTab[index] === 'en' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                        onClick={() => setActiveSceneTab(prev => ({ ...prev, [index]: 'en' }))}
                                    >
                                        English
                                    </button>
                                </div>
                                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                    {activeSceneTab[index] === 'id' ? scene.indonesian : scene.english}
                                </div>
                                {/* Copy Prompt Button for individual scene */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => copyScenePromptToClipboard(scene, index)}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center text-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                        </svg>
                                        {copySuccess[index] || 'Salin Prompt Adegan Ini'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
