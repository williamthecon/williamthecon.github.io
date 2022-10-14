const subnav_buttons = document.getElementsByClassName("subnav-button");

for (let i = 0; i < subnav_buttons.length; i++) {
    subnav_buttons[i].addEventListener('click', function handleClick() {
        const link = document.getElementById("subnav-" + (i + 1) + "-link");
        if (link != null) {
            window.location.href = link.href;
        }
    });
}
