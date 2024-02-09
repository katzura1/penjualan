$(document).ready(function () {
  //form import on submit
  $("#form-import").on("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(this);
    ajax_post({
      type: "POST",
      url: "/resi-product/summary-of-import",
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function (data) {
        Swal.close();
        if (data.code == 200) {
          $("#form-import")[0].reset();

          //destroy datable
          $("#table").DataTable().destroy();
          //load data.data to table
          let html = "";
          Object.entries(data.data).forEach(([code, item]) => {
            html += `
                <tr>
                    <td>${code}</td>
                    <td>${item.nama}</td>
                    <td>${item.qty}</td>
                </tr>
            `;
          });
          $("#table tbody").html(html);
          //init datatable with export excel
          $("#table").DataTable({
            order: [],
            dom: "Bfrtip",
            buttons: ["excel"],
          });

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
