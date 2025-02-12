<template>
  <ul class="quickreply-message" :class="{ expired: replySent || isExpired }">
    <li
      v-for="(reply, idx) in quickreplies"
      :key="idx"
      class="quickreply-message__item"
      :class="{ selected: replySent && selected === idx }"
      @click="onSelect(reply, idx)"
    >
      {{ reply.title }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'QuickreplyMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator: (message) => {
        return (
          message &&
          message.type === 'quickreply' &&
          message.data &&
          message.data.quick_replies &&
          message.data.quick_replies.length > 0
        );
      },
    },
  },
  computed: {
    quickreplies() {
      return this.message.data.quick_replies;
    },
    replySent() {
      return !!this.message.selected || this.message.selected === 0;
    },
    selected() {
      return this.message.selected;
    },
    isExpired() {
      const { messageList } = this.$teneoApi;
      const latestMessage = messageList[messageList.length - 1];

      return latestMessage && latestMessage !== this.message;
    },
  },
  methods: {
    async onSelect(reply, idx) {
      if (this.replySent || this.isExpired) {
        return;
      }

      const numMessages = this.$teneoApi.messageList.length;
      const messages = this.$teneoApi.messageList.slice(0, numMessages - 1);
      const quickreplyMessage = this.$teneoApi.messageList[numMessages - 1];

      const selectedQuickReply = { ...quickreplyMessage, selected: idx };

      this.$teneoApi.messageList = [...messages, selectedQuickReply];

      await this.$teneoApi.sendSilentMessage(reply.postback);
    },
  },
};
</script>

<style scoped>
.quickreply-message {
  --expired-quickreply-color: #a9a9a9;

  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.quickreply-message__item {
  border: 1px solid var(--user-message-bg-color);
  border-radius: 12px;
  padding: 8px 14px 8px 14px;
  color: var(--user-message-bg-color);
  cursor: pointer;
  margin-right: 10px;
  margin-left: 5px;
  font-size: 0.8rem;
}

.quickreply-message__item.selected,
.quickreply-message:not(.expired) .quickreply-message__item:hover {
  background: var(--user-message-bg-color);
  color: var(--user-message-fg-color);
}

.quickreply-message__item.selected,
.quickreply-message:not(.expired) .quickreply-message__item:hover {
  background: var(--user-message-bg-color);
  color: var(--user-message-fg-color);
}

.quickreply-message.expired .quickreply-message__item:not(.selected) {
  cursor: default;
  color: var(--expired-quickreply-color);
  border-color: var(--expired-quickreply-color);
}
</style>
