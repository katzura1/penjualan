$(document).ready(function () {
  //form import on submit
  $("#form-import").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    ajax_post({
      type: "POST",
      url: "/resi-product/delivered",
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        Swal.close();
        if (data.code == 200) {
          $("#form-import")[0].reset();
          show_success({
            html: "Data berhasil diimport",
          });
        } else {
          show_error({
            html: data.message,
          });
        }
      },
      error: function (xhr, status, error) {
        const message = xhr.responseJSON.message;
        show_error({
          html: message,
        });
      },
    });
  });
});
