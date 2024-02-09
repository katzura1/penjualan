$(document).ready(function () {
  const selectCategory = tomSelectInit(
    '#modal-product select[name="product_category_id"]'
  );

  $("button[id=btn-add]").on("click", function () {
    $('#modal-product input[name="id"]').val("");
    $('#modal-product input[name="barcode"]').val("");
    $('#modal-product input[name="name"]').val("");
    selectCategory.setValue("");
    $("#modal-product").modal("show");
  });

  $("button[id=btn-import]").on("click", function () {
    $("#modal-import").modal("show");
  });

  $("#form-product").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);
    const id = $("#form-product input[name=id]").val();

    const post = () => {
      ajax_post({
        url: !is_not_empty(id) ? "/product/store" : "/product/update",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                $("#modal-product").modal("hide");
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

  $("#modal-product #btn-save").on("click", function () {
    const form = $("#form-product");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });

  const table = new DataTable("#table", {
    ajax: {
      url: "/product/data",
      type: "GET",
    },
    columns: [
      {
        data: "barcode",
      },
      {
        data: "name",
      },
      {
        data: "product_category.name",
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

    $('#modal-product input[name="id"]').val(data.id);
    $('#modal-product input[name="barcode"]').val(data.barcode);
    $('#modal-product input[name="name"]').val(data.name);

    selectCategory.setValue(data.product_category_id);
    $("#modal-product").modal("show");
  });

  $("#table tbody").on("click", "button.btn-delete", function () {
    const data = table.row($(this).closest("tr")).data();

    const post = () => {
      ajax_post({
        url: "/product/destroy",
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

  $("#form-import").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);

    const post = () => {
      ajax_post({
        url: "/product/import",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                $("#modal-import").modal("hide");
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

  $("#modal-import #btn-save").on("click", function () {
    const form = $("#form-import");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });
});
