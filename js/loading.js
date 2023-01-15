export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <div class="loading" :class="{'-show':isShow}">
      <div class="loader"></div>
    </div>
  `,
};
