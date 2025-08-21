// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenuOverlay.classList.remove('hidden');
        // Add slide down animation
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    } else {
        mobileMenu.classList.add('hidden');
        mobileMenuOverlay.classList.add('hidden');
        mobileMenu.style.maxHeight = '0';
    }
}

// Course Progress Tracking
let courseProgress = {
    completed: [],
    current: 'lesson1'
};

function markLessonComplete(lessonId) {
    if (!courseProgress.completed.includes(lessonId)) {
        courseProgress.completed.push(lessonId);
        updateProgressUI();
    }
}

function updateProgressUI() {
    const totalLessons = document.querySelectorAll('.lesson-item').length;
    const completedLessons = courseProgress.completed.length;
    const progressPercentage = (completedLessons / totalLessons) * 100;
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Update lesson status indicators
    courseProgress.completed.forEach(lessonId => {
        const lessonStatus = document.querySelector(`#${lessonId} .lesson-status`);
        if (lessonStatus) {
            lessonStatus.classList.add('completed');
            lessonStatus.innerHTML = '<i class="fas fa-check"></i>';
        }
    });
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu button click handler
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    
    // Initialize progress
    updateProgressUI();
    
    // Auto-play video when lesson is clicked
    document.querySelectorAll('.lesson-item').forEach(lesson => {
        lesson.addEventListener('click', function(e) {
            const videoId = this.getAttribute('data-video');
            if (videoId) {
                const videoPlayer = document.querySelector(`#video-${videoId}`);
                if (videoPlayer) {
                    videoPlayer.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});
