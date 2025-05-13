const userToggle = document.getElementById("userToggle");
const dropdownMenu = document.getElementById("dropdownMenu");

userToggle.addEventListener("click", () => {
	dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
});
document.addEventListener("click", (e) => {
	if (!e.target.closest(".user-dropdown")) {
		dropdownMenu.style.display = "none";
	}
});

$(".button").click(function () {
	var buttonId = $(this).attr("id");
	$("#modal-container").removeAttr("class").addClass(buttonId);
	$("body").addClass("modal-active");
});

$("#modal-container").click(function () {
	$(this).addClass("out");
	$("body").removeClass("modal-active");
});

function search() {
	$.ajax({
		type: "get",
		url: "data/fake-data.json",
		dataType: "json",
		data: {
			search: $(".search").val(),
		},
		success: function (data) {
			load_diagram(data);
		},
		error: function (error) {
			console.error("Erro ao buscar dados do organograma:", error);
		},
	});
}

start_diagram("myDiagramDiv");
search();

var search_timeout = 0;
var last_search = "";
$(".search").keyup((e) => {
	clearTimeout(search_timeout);

	if ($(".search").val() != last_search) {
		search_timeout = setTimeout(function () {
			last_search = $(".search").val();
			search();
			console.log(`Search: ${last_search}`);
		}, 500);
	}
});

// Botão reload
document.getElementById("update").addEventListener("click", function (e) {
	e.preventDefault();
	location.reload();
});
