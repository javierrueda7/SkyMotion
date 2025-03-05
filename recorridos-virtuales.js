// Import necessary libraries.  These should be included in your HTML file via `<script>` tags.
// For example:  <script src="https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.min.js"></script>
// and: <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
// and: <script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Pannellum viewer for main panorama
  const panoramaViewer = pannellum.viewer("panorama", {
    type: "equirectangular",
    panorama:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_0194.JPG-PegknNGXrhI2zQ4eRDVXCrQNXDOIBQ.jpeg",
    autoLoad: true,
    compass: true,
    hotSpots: [
      {
        pitch: -3,
        yaw: 117,
        type: "info",
        text: "Edificio Mirador - Vista Este",
      },
      {
        pitch: -5,
        yaw: 15,
        type: "info",
        text: "Parque Central",
      },
      {
        pitch: 0,
        yaw: -51,
        type: "info",
        text: "Centro Comercial",
      },
    ],
  })

  // Initialize Pannellum viewer for modal
  let modalViewer
  document.getElementById("tourModal").addEventListener("shown.bs.modal", () => {
    if (!modalViewer) {
      modalViewer = pannellum.viewer("modalPanorama", {
        type: "equirectangular",
        panorama:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DJI_0194.JPG-PegknNGXrhI2zQ4eRDVXCrQNXDOIBQ.jpeg",
        autoLoad: true,
        compass: true,
      })
    } else {
      modalViewer.resize()
    }
  })

  // Initialize Three.js for 3D model viewer
  let modelScene, modelCamera, modelRenderer, modelControls, modelObject

  document.getElementById("modelModal").addEventListener("shown.bs.modal", () => {
    initModelViewer()
  })

  function initModelViewer() {
    const container = document.getElementById("modelViewer")

    // Create scene
    modelScene = new THREE.Scene()
    modelScene.background = new THREE.Color(0xf1f5f9)

    // Create camera
    modelCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    modelCamera.position.z = 5

    // Create renderer
    modelRenderer = new THREE.WebGLRenderer({ antialias: true })
    modelRenderer.setSize(container.clientWidth, container.clientHeight)
    container.innerHTML = ""
    container.appendChild(modelRenderer.domElement)

    // Add controls
    modelControls = new THREE.OrbitControls(modelCamera, modelRenderer.domElement)
    modelControls.enableDamping = true
    modelControls.dampingFactor = 0.25

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    modelScene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 1)
    modelScene.add(directionalLight)

    // Load sample model (cube for now, would be replaced with actual GLB/GLTF model)
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const material = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      metalness: 0.3,
      roughness: 0.4,
    })
    modelObject = new THREE.Mesh(geometry, material)
    modelScene.add(modelObject)

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)
      modelControls.update()
      modelObject.rotation.y += 0.005
      modelRenderer.render(modelScene, modelCamera)
    }

    animate()

    // Handle window resize
    window.addEventListener("resize", () => {
      if (modelCamera && modelRenderer) {
        modelCamera.aspect = container.clientWidth / container.clientHeight
        modelCamera.updateProjectionMatrix()
        modelRenderer.setSize(container.clientWidth, container.clientHeight)
      }
    })
  }

  // Fullscreen functionality
  document.getElementById("fullscreen").addEventListener("click", () => {
    panoramaViewer.toggleFullscreen()
  })

  document.getElementById("modalFullscreen").addEventListener("click", () => {
    if (modalViewer) {
      modalViewer.toggleFullscreen()
    }
  })

  document.getElementById("modelFullscreen").addEventListener("click", () => {
    const modelContainer = document.getElementById("modelViewer")
    if (modelContainer.requestFullscreen) {
      modelContainer.requestFullscreen()
    } else if (modelContainer.mozRequestFullScreen) {
      modelContainer.mozRequestFullScreen()
    } else if (modelContainer.webkitRequestFullscreen) {
      modelContainer.webkitRequestFullscreen()
    } else if (modelContainer.msRequestFullscreen) {
      modelContainer.msRequestFullscreen()
    }
  })

  // Info toggle
  document.getElementById("info-toggle").addEventListener("click", () => {
    const tourInfo = document.querySelector(".tour-info")
    tourInfo.classList.toggle("d-none")
  })

  // File upload functionality
  setupFileUpload("insta360DropArea", "insta360Files", "insta360FileList")
  setupFileUpload("model3dDropArea", "model3dFiles", "model3dFileList")

  function setupFileUpload(dropAreaId, inputId, fileListId) {
    const dropArea = document.getElementById(dropAreaId)
    const input = document.getElementById(inputId)
    const fileList = document.getElementById(fileListId)
    const browseLink = dropArea.querySelector(".browse-link")

    // Open file dialog when clicking on browse link
    browseLink.addEventListener("click", () => {
      input.click()
    })

    // Handle file selection
    input.addEventListener("change", function () {
      handleFiles(this.files)
    })

    // Prevent default drag behaviors
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })

    function preventDefaults(e) {
      e.preventDefault()
      e.stopPropagation()
    }
    // Highlight drop area when dragging over it
    ;["dragenter", "dragover"].forEach((eventName) => {
      dropArea.addEventListener(eventName, highlight, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })

    function highlight() {
      dropArea.classList.add("dragover")
    }

    function unhighlight() {
      dropArea.classList.remove("dragover")
    }

    // Handle dropped files
    dropArea.addEventListener("drop", (e) => {
      const dt = e.dataTransfer
      const files = dt.files
      handleFiles(files)
    })

    function handleFiles(files) {
      fileList.innerHTML = ""

      if (files.length === 0) return

      Array.from(files).forEach((file) => {
        // Create file item element
        const fileItem = document.createElement("div")
        fileItem.className = "file-item"

        // Get file extension
        const extension = file.name.split(".").pop().toLowerCase()

        // Determine icon based on file type
        let iconClass = "bi-file-earmark"
        if (["jpg", "jpeg", "png"].includes(extension)) {
          iconClass = "bi-file-earmark-image"
        } else if (["insp", "insv"].includes(extension)) {
          iconClass = "bi-camera-video"
        } else if (["glb", "gltf", "obj", "fbx"].includes(extension)) {
          iconClass = "bi-box"
        }

        // Format file size
        const fileSize = formatFileSize(file.size)

        // Create file info HTML
        fileItem.innerHTML = `
                    <div class="file-info">
                        <i class="bi ${iconClass} file-icon"></i>
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${fileSize}</span>
                    </div>
                    <i class="bi bi-x-circle file-remove"></i>
                `

        // Add remove functionality
        const removeBtn = fileItem.querySelector(".file-remove")
        removeBtn.addEventListener("click", () => {
          fileItem.remove()
        })

        fileList.appendChild(fileItem)
      })
    }

    function formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes"

      const k = 1024
      const sizes = ["Bytes", "KB", "MB", "GB"]
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }
  }

  // Form submission
  document.getElementById("insta360Form").addEventListener("submit", function (e) {
    e.preventDefault()

    // Show success message
    alert("¡Gracias por enviar tus archivos! Te contactaremos pronto para coordinar tu recorrido virtual.")
    this.reset()
    document.getElementById("insta360FileList").innerHTML = ""
  })

  document.getElementById("model3dForm").addEventListener("submit", function (e) {
    e.preventDefault()

    // Show success message
    alert("¡Gracias por enviar tus archivos 3D! Te contactaremos pronto para coordinar tu modelo interactivo.")
    this.reset()
    document.getElementById("model3dFileList").innerHTML = ""
  })

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Back to top button
  const backToTopButton = document.querySelector(".back-to-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("active")
    } else {
      backToTopButton.classList.remove("active")
    }
  })

  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
})

