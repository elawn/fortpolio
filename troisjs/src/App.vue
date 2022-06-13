<template>
  <Renderer ref="rendererC" antialias :orbit-ctrl="{ enableDamping: true }" resize="window">
    <Camera :position="{ z: 10 }"/>
    <Scene ref="sceneC">
      <PointLight :position="{ y: 50, z: 50 }"/>
      <Text
          font-src="/fonts/helvetiker_bold.typeface.json"
          text="Hello World!"
          :size="0.5"
          :height="0.2"
          :curve-segments="15"
          :bevel-enabled="true"
          :bevel-thickness="0.03"
          :bevel-size="0.02"
          :bevel-offset="0"
          :bevel-segments="4"
          ref="textC"
      >
        <MatcapMaterial name="3A3329_C9B090_928069_A9957A"/>
      </Text>
    </Scene>
  </Renderer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Camera, MatcapMaterial, PointLight, Renderer, Scene, Text } from 'troisjs'

const rendererC = ref()
const sceneC = ref()
const textC = ref()

onMounted( () => {
  const renderer = rendererC.value
  const scene = sceneC.value.scene
  const text = textC.value

  renderer.onBeforeRender( () => {

  } )
} )
</script>

<style>
body {
  margin: 0;
}

canvas {
  display: block;
}
</style>
