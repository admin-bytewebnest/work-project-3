const burger = document.querySelector(".header__burger")
if (burger) {
  let opened = false
  let busy = false
  burger.addEventListener("click", () => {
    if (busy) return
    busy = true
    if (!opened) {
      burger.classList.add("merge")
      setTimeout(() => {
        burger.classList.add("cross")
      }, 600)
      setTimeout(() => {
        opened = true
        busy = false
      }, 900)
    } else {
      burger.classList.remove("cross")
      setTimeout(() => {
        burger.classList.remove("merge")
      }, 300)
      setTimeout(() => {
        opened = false
        busy = false
      }, 600)
    }
  })
}
