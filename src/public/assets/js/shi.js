/*shi CRUD scripts*/

function shiNew(event) {
  event.preventDefault();
  // console.log(event);
  /*var element = $(event.target).is('a') ? $(event.target) : $(event.target).parents('a');*/
  var element = $(event.currentTarget);
  //console.log(element);
  var url = element.attr("href");
  //console.log(url)
  var title = element.data("title");
  var type = element.data("type");
  var size = element.data("size");

  title = title ? title : "Add new";
  size = size ? size : "m";
  type = type ? type : "";

  dialog(url, title, size, type);
}

function shiEdit(event) {
  event.preventDefault();

  /*var element = $(event.target).is('a') ? $(event.target) : $(event.target).parents('a');*/
  var element = $(event.currentTarget);
  var url = element.attr("href");
  var title = element.data("title");
  var type = element.data("type");
  var size = element.data("size");

  title = title ? title : "Edit entity";
  size = size ? size : "m";
  type = type ? type : "";
  // console.log(size);

  dialog(url, title, size, type);
}
function shiSub(event) {
  event.preventDefault();

  /*var element = $(event.target).is('a') ? $(event.target) : $(event.target).parents('a');*/
  var element = $(event.currentTarget);
  var url = element.attr("href");
  var title = element.data("title");
  var type = element.data("type");
  var size = element.data("size");

  title = title ? title : "Edit entity";
  size = size ? size : "m";
  type = type ? type : "";
  // console.log(size);

  dialog(url, title, size, type);
}

function dialog(url, title = "Operation", size, type = "") {
  var jesus = $.confirm({
    content: function () {
      var self = this;
      return $.ajax({
        url: url,
        method: "get",
      })
        .done(function (data) {
          self.setContent(data);
          self.setTitle(title);
        })
        .fail(function (err) {
          console.log(err);
          self.setContent("Something went wrong");
        });
    },
    buttons: {
      Close: function (helloButton) {
        // shorthand method to define a button
        // the button key will be used as button name
      },
    },
    columnClass: size,
    type: type,
    containerFluid: true,
    draggable: true,
    backgroundDismiss: true,
    // defaultButtons: {
    //     ok: {
    //         action: function () {},
    //     },
    //     close: {
    //         action: function () {},
    //     },
    // },
    //type:type
  });
}

////Function to show form for session editing
function get_lga2(url) {
  //var url = element.attr('href');
  var state_id = $("#state").val();
  console.log(state_id);
  if (state_id === " ") {
    var html = "";
    $("#lga").html("<option value=>Choose</option>");
  }

  $.ajax({
    type: "POST",
    url: url,
    dataType: "json",
    data: { state_id: state_id },
    success: function (data) {
      //console.log(data)

      if (data && data != "") {
        var html = "";
        var i;
        for (i = 0; i < data.length; i++) {
          html +=
            "<option value=" + data[i].id + ">" + data[i].name + "</option>";
        }
        $("#lga").html(html);
      } else {
        $("#lga").html("<option value=>Choose</option>");
      }
    },
  });
}

function get_lga() {
  /*Ajax fetch lgas*/
  $("#state").change(function () {
    var id = $(this).val();
    var that = $("#lga");
    that.html("<option value=''>Collecting local governments......</option>");
    $.get(
      "<?php echo base_url(students/student_registration) ?>",
      { state_id: id },
      function (data) {
        var lgas = "";
        var data = data.lgas;
        $.each(data, function (i, value) {
          lgas +=
            "<option value='" + value.id + "'>" + value.name + "</option>";
        });

        that.html(lgas);
      }
    );
  });
}
