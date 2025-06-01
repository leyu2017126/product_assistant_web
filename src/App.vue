<template>
  <div>
    <input v-model="userAnswer" placeholder="输入答案" />
    <button @click="submitAnswer">提交</button>
    <div>
      <h3>流式响应：</h3>
      <pre>{{ streamResponse }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

const userAnswer = ref('')
const streamResponse = ref('')
const ctrl = ref(new AbortController())

// 初始化请求（添加跨域配置）
const init = async () => {
  try {
    const response = await fetch('/plus/chat_qnaire/qnaire/inital', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // 携带跨域凭证
    })

    if (!response.ok) throw new Error(`HTTP错误! 状态码：${response.status}`)

    const { code, msg } = await response.json()
    if (code === 200) {
      streamResponse.value = msg // 修正变量名
    } else {
      console.error('初始化失败:', msg)
    }
  } catch (err) {
    console.error('初始化错误:', err)
  }
}

// 提交请求（添加跨域配置）
const start = async () => {
  streamResponse.value = ''
  ctrl.value = new AbortController()

  try {
    await fetchEventSource('/plus/chat_qnaire/qnaire/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer: userAnswer.value }),
      signal: ctrl.value.signal,
      credentials: 'include', // 跨域携带凭证
      onopen: async (response) => {
        if (response.ok) return
        throw new Error(`HTTP error! status: ${response.status}`)
      },
      onmessage: (event) => {
        streamResponse.value += event.data + ' '
      },
      onerror: (err) => {
        throw err
      }
    })
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('请求错误:', err)
    }
  }
}

// 提交请求（添加跨域配置）
const submitAnswer = async () => {
  streamResponse.value = ''
  ctrl.value = new AbortController()

  try {
    await fetchEventSource('/plus/chat_qnaire/qnaire/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer: userAnswer.value }),
      signal: ctrl.value.signal,
      credentials: 'include', // 跨域携带凭证
      onopen: async (response) => {
        if (response.ok) return
        throw new Error(`HTTP error! status: ${response.status}`)
      },
      onmessage: (event) => {
        streamResponse.value += event.data + ' '
      },
      onerror: (err) => {
        throw err
      }
    })
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('请求错误:', err)
    }
  }
}

onMounted(() => {
  init()
  start()
})

onBeforeUnmount(() => {
  ctrl.value.abort()
})
</script>

<style>
pre {
  white-space: pre-wrap;
  overflow-wrap: break-word;
  max-width: 600px;
  border: 1px solid #ddd;
}
</style>
