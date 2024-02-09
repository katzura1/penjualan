$(document).ready(function () {
  $("#form-password-admin").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);

    const post = () => {
      ajax_post({
        url: "/setting/password",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                location.reload();
              },
            });
          } else {
            show_error({
              html: result.message ?? "Data gagal disimpan",
            });
          }
        },
      });
    };

    prompt_swal(post);
  });

  $("#btn-save").on("click", function () {
    const form = $("#form-password-admin");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });
});
