export default {
  data() {
    return {
      modal: {},
    };
  },
  props: {
    tempContent: {
      type: Object,
      default: {},
    },
    // 接收外層url
    apiUrl: {
      type: String,
      default: "",
    },
    // 接收外層path
    apiPath: {
      type: String,
      default: "",
    },
  },
  methods: {
    deleteItem(id) {
      axios
        .delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${id}`)
        .then((res) => {
          // 外層傳入 取得所有商品
          this.$emit("update-data");
          this.closeModal();
          alert(res.data.message);
        })
        .catch((err) => {
          // 顯示失敗資訊
          alert(err.data.message);
        });
    },
    openDelProductModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
  },
  template: `
    <div class="modal fade" ref="modal"
      tabindex="-1"
      aria-labelledby="delProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content border-0">
          <div class="modal-header bg-danger text-white">
            <h5 id="delProductModalLabel" class="modal-title">
              <span>刪除產品</span>
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            是否刪除
            <strong class="text-danger">{{ tempContent.title }}</strong>
            商品(刪除後將無法恢復)。
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="closeModal"
              >
              取消
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="deleteItem(tempContent.id)"
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
};
