$(document).ready(function () {
  const table = new DataTable("#table", {
    processing: true,
    serverSide: true,
    ordering: false,
    ajax: {
      url: "/user/data",
      type: "GET",
    },
    columns: [
      {
        data: "username",
      },
      {
        data: "name",
      },
      {
        data: "level",
      },
      {
        data: "status",
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `
                <div class="d-flex flex-wrap gap-2">
                    <button type="button" class="btn btn-primary btn-edit">
                        <img class="icon" src="/img/icons/edit.svg">
                    </button>
                </div>
                `;
        },
      },
    ],
  });

  $("#btn-add").on("click", function () {
    $('#modal-user input[name="id"]').val("");
    $('#modal-user input[name="username"]').val("");
    $('#modal-user input[name="name"]').val("");
    $('#modal-user select[name="level"]').val("");
    $('#modal-user select[name="status"]').val("");

    $('#modal-user input[name="password"]').prop("required", true);
    $("label.form-label-password").addClass("required");
    $("");
    $("#modal-user").modal("show");
  });

  $("#form-user").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);
    const id = $("#form-user input[name=id]").val();
    const password = $("#form-user input[name=password]").val();
    if (!is_not_empty(password)) {
      formData = removeField(formData, "password");
    }
    const post = () => {
      ajax_post({
        url: !is_not_empty(id) ? "/user/store" : "/user/update",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                $("#modal-user").modal("hide");
                table.ajax.reload();
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
    const form = $("#form-user");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });

  $("#table tbody").on("click", "button.btn-edit", function () {
    const data = table.row($(this).closest("tr")).data();

    $('#modal-user input[name="id"]').val(data.id);
    $('#modal-user input[name="username"]').val(data.username);
    $('#modal-user input[name="name"]').val(data.name);
    $('#modal-user select[name="level"]').val(data.level);
    $('#modal-user select[name="status"]').val(data.status);

    $('#modal-user input[name="password"]').prop("required", false);
    $("label.form-label-password").removeClass("required");

    $("#modal-user").modal("show");
  });
});
