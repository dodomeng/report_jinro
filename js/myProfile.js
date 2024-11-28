const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdown");
const toggleArrow = document.getElementById("menuArrow");

const toggleDropdown = function () {
  dropdownMenu.classList.toggle("show");
  toggleArrow.classList.toggle("arrow");
};

dropdownBtn.addEventListener("click", function (e) {
  e.stopPropagation();
  toggleDropdown();
});

document.documentElement.addEventListener("click", function () {
  if (dropdownMenu.classList.contains("show")) {
    toggleDropdown();
  }
});

function showReport(reportNumber) {
    // 모든 보고서 내용을 숨김
    const allReports = document.querySelectorAll('.report-content');
    allReports.forEach(report => report.classList.remove('active'));

    // 선택한 보고서만 표시
    const selectedReport = document.getElementById(`report-${reportNumber}`);
    if (selectedReport) {
      selectedReport.classList.add('active');
    }
  }