function toggleOriginallyrics() {
    let elements = document.getElementsByClassName("original"); 
    for (let element of elements) {
        if (element.classList.contains("show")) {
            element.classList.remove("show");
        } else {
            element.classList.add("show");
        }
    }
}
function toggleHatsuonlyrics() {
    let elements = document.getElementsByClassName("hatsuon"); 
    for (let element of elements) {
        if (element.classList.contains("show")) {
            element.classList.remove("show");
        } else {
            element.classList.add("show");
        }
    }
}
function toggleTranslationlyrics() {
    let elements = document.getElementsByClassName("translation"); 
    for (let element of elements) {
        if (element.classList.contains("show")) {
            element.classList.remove("show");
        } else {
            element.classList.add("show");
        }
    }
}
function toggleIsshoniUtattelyrics() {
    let elements = document.getElementsByClassName("isshoni-utatte"); 
    let isChecked = document.getElementById("toggleisshoniutatte").checked;
    for (let element of elements) {
        if (isChecked && !element.classList.contains("sing")){
            element.classList.add("sing");
        }
        else if (element.classList.contains("sing")) {
            element.classList.remove("sing");
        }
    }
}

function toggleDarkmode() {
    // body 태그에 dark-mode 클래스를 토글
    document.body.classList.toggle('dark-mode');
    //document.div.classList.toggle('dark-mode');
}
function toggleDeepDarkmode() {
    // body 태그에 dark-mode 클래스를 토글
    document.body.classList.toggle('deep-dark-mode');
    //document.div.classList.toggle('dark-mode');
}


document.addEventListener("DOMContentLoaded", function () {
    // 토글 ID 및 해당 함수 매핑
    const toggleActions = {
        "toggleoriginal": toggleOriginallyrics,
        "togglehatsuon": toggleHatsuonlyrics,
        "toggletranslation": toggleTranslationlyrics,
        "toggleisshoniutatte": toggleIsshoniUtattelyrics,
        "toggleDarkmode": toggleDarkmode,
        "toggleDeepDarkmode": toggleDeepDarkmode
    };

    // 토글 상태 적용 및 실행
    Object.keys(toggleActions).forEach(id => {
        const toggle = document.getElementById(id);
        const savedState = localStorage.getItem(id);

        if (savedState === "true") {
            toggle.checked = true;
            toggleActions[id]();  // 저장된 상태가 true면 해당 함수 실행
        }

        // 변경 감지 및 저장
        toggle.addEventListener("change", function () {
            localStorage.setItem(id, this.checked);
            toggleActions[id]();  // 토글이 변경될 때도 함수 실행
        });
    });
});

function toggleMenu() {
    document.querySelector(".nav-links").classList.toggle("active");
}

function openModal() {
    document.getElementById("modalOverlay").style.display = "flex";
}
function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
}
document.getElementById("modalOverlay").addEventListener("click", function(event) {
    if (event.target === this) {
        closeModal();
    }
});

function openSidebar(){
    element = document.getElementById("sidebar");
    if (element.classList.contains("active")) {
        element.classList.remove("active");
        document.getElementById("sidebarOverlay").style.display = "none";
    } else {
        element.classList.add("active");
        document.getElementById("sidebarOverlay").style.display = "flex";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");

    // 터치 이벤트를 감지하여 스와이프 기능 추가
    let startX = 0;

    document.addEventListener("touchstart", function (event) {
        startX = event.touches[0].clientX;
    });

    document.addEventListener("touchmove", function (event) {
        let endX = event.touches[0].clientX;
        let diffX = endX - startX;

        if (diffX > 100) { // 오른쪽으로 스와이프하면 열림
            sidebar.classList.add("active");
        } else if (diffX < -100) { // 왼쪽으로 스와이프하면 닫힘
            sidebar.classList.remove("active");
        }
    });
});