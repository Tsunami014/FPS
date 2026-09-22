if (PAGE == "admin") {
  return new Objs.BasePage("Stage", [
    new Objs.Text("Test", {
      text: "Testing!",
    }),
  ], {
    open: true,
    default: true,
  })
}
