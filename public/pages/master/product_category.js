$(document).ready(function () {
  $("button[id=btn-add]").on("click", function () {
    $('#modal-product-category input[name="id"]').val("");
    $('#modal-product-category input[name="name"]').val("");
    $("#modal-product-category").modal("show");
  });

  $("#form-product-category").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);
    const id = $("#form-product-category input[name=id]").val();

    const post = () => {
      ajax_post({
        url: !is_not_empty(id)
          ? "/product-category/store"
          : "/product-category/update",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                $("#modal-product-category").modal("hide");
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
    const form = $("#form-product-category");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });

  const table = new DataTable("#table", {
    ajax: {
      url: "/product-category/data",
      type: "GET",
    },
    columns: [
      {
        data: "name",
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `
            <div class="d-flex flex-row gap-2">
                <button type="button" class="btn btn-primary btn-edit">
                    <img class="icon" src="/img/icons/edit.svg">
                </button>
                <button type="button" class="btn btn-danger btn-delete">
                    <img class="icon" src="/img/icons/trash-x.svg">
                </button>
            </div>
            `;
        },
        orderable: false,
      },
    ],
  });

  $("#table tbody").on("click", "button.btn-edit", function () {
    const data = table.row($(this).closest("tr")).data();

    $('#modal-product-category input[name="id"]').val(data.id);
    $('#modal-product-category input[name="name"]').val(data.name);

    $("#modal-product-category").modal("show");
  });

  $("#table tbody").on("click", "button.btn-delete", function () {
    const data = table.row($(this).closest("tr")).data();

    const post = () => {
      ajax_post({
        url: "/product-category/destroy",
        data: {
          id: data.id,
        },
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil dihapus",
              didClose: function () {
                table.ajax.reload();
              },
            });
          } else {
            show_error({
              html: result.message ?? "Data gagal dihapus",
            });
          }
        },
      });
    };

    prompt_swal(post, textDelete);
  });
});
