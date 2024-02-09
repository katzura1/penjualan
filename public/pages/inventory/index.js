$(document).ready(function () {
  const selectCategory = tomSelectInit("select[name=product_category_id]");
  const selectProductIn = tomSelectInit(
    "#modal-stock-in select[name=product_id]"
  );
  const selectProductOut = tomSelectInit(
    "#modal-stock-out select[name=product_id]"
  );
  const passwordAdmin = $('input[name="password_admin"]').val();

  const table = $("#table").DataTable({
    ajax: {
      url: "/inventory/data",
      type: "GET",
      data: function (d) {
        d.product_category_id = selectCategory.getValue();
      },
    },
    order: [],
    columns: [
      {
        data: "barcode",
      },
      {
        data: "product_name",
      },
      {
        data: "qty",
      },
      {
        data: "id",
        render: function (data, type, row) {
          return `
            <div class="d-flex flex-row gap-2">
                <button type="button" class="btn btn-primary btn-edit">
                    Edit
                </button>
                <button type="button" class="btn btn-danger btn-delete">
                    Delete
                </button>
                <button type="button" class="btn btn-info btn-history">
                    History
                </button>
            </div>
            `;
        },
        width: "100px",
        orderable: false,
      },
    ],
  });

  selectCategory.on("change", function () {
    table.ajax.reload();
  });

  $("#table tbody").on("click", "button.btn-edit", function () {
    const data = table.row($(this).parents("tr")).data();
    const edit = () => {
      $("#modal-edit").find('input[name="id"]').val(data.id);
      $("#modal-edit")
        .find('input[name="name"]')
        .val(data.barcode + " " + data.product_name);

      $("#modal-edit").find('input[name="qty"]').val(data.qty);

      $("#modal-edit").modal("show");
    };

    confirmPasswordAdmin(passwordAdmin, edit); //functions.js
  });

  $("button[id=btn-import]").on("click", function () {
    $("#modal-import").modal("show");
  });

  $("#form-import").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);

    const post = () => {
      ajax_post({
        url: "/inventory/import-stock-in",
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

  $("#form-edit").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);

    const post = () => {
      ajax_post({
        url: "/inventory/update",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                $("#modal-edit").modal("hide");
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

  $("#modal-edit #btn-save").on("click", function () {
    const form = $("#form-edit");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });

  $("#table tbody").on("click", "button.btn-delete", function () {
    const data = table.row($(this).parents("tr")).data();
    const del = () => {
      const post = () => {
        ajax_post({
          url: "/inventory/destroy",
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
    };

    confirmPasswordAdmin(passwordAdmin, del); //functions.js
  });

  $("#table tbody").on("click", "button.btn-history", function () {
    const data = table.row($(this).parents("tr")).data();

    $.ajax({
      url: "/inventory/data-history",
      type: "GET",
      data: {
        inventory_id: data.id,
      },
      beforeSend: function () {
        before_send();
      },
      success: function (result) {
        Swal.close();
        let html = "";
        const rowHistory = (item) => {
          return `
          <tr>
            <td>${item.created_at}</td>
            <td>${item.qty}</td>
            <td>${item.type}</td>
          </tr>
          `;
        };
        result.data.forEach((item, index) => {
          html += rowHistory(item);
        });
        $("#table-history tbody").html(html);
        $("#modal-history").modal("show");
      },
    });
  });

  $("#btn-in").on("click", function () {
    $("#modal-stock-in").modal("show");
  });

  //store stock in
  $("#form-stock-in").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);

    const post = () => {
      ajax_post({
        url: "/inventory/store-stock-in",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                //reset form stock in
                $("#form-stock-in")[0].reset();
                selectProductIn.clear();
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

  $("#btn-out").on("click", function () {
    $("#modal-stock-out").modal("show");
  });

  //store stock out
  $("#form-stock-out").on("submit", function (e) {
    e.preventDefault();
    let formData = new FormData($(this)[0]);

    const post = () => {
      ajax_post({
        url: "/inventory/store-stock-out",
        data: formData,
        processData: false,
        contentType: false,
        success: function (result) {
          Swal.close();
          if (result.code == 200) {
            show_success({
              html: result.message ?? "Data berhasil disimpan",
              didClose: function () {
                //reset form stock in
                $("#form-stock-out")[0].reset();
                selectProductOut.clear();
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

  //btn save in and out
  $("#modal-stock-in #btn-save").on("click", function () {
    const form = $("#form-stock-in");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });

  $("#modal-stock-out #btn-save").on("click", function () {
    const form = $("#form-stock-out");
    // Trigger HTML5 validity.
    const reportValidity = form[0].reportValidity();
    // Then submit if form is OK.
    if (reportValidity) {
      form.submit();
    }
  });
});
