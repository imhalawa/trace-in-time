$(document).ready(function () {
  // Init Masonry
  var $grid = $(".grid").masonry({
    gutter: 10,
    horizontalOrder: true,
    itemSelector: ".grid-item",
  });
  // Layout Masonry after each image loads
  $grid.imagesLoaded().progress(function () {
    $grid.masonry("layout");
  });
});

$(document).ready(function () {
  $(".masonry-grid").each(function () {
    var $gallery = $(this).masonry({
      itemSelector: ".masonry-item",
      percentPosition: true,
      gutter: 10,
      horizontalOrder: true,
    });

    $gallery.imagesLoaded().progress(function () {
      $gallery.masonry("layout");
    });
  });
});
