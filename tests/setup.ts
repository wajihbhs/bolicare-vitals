import { config } from "@vue/test-utils"
import { vi } from "vitest"

// Stub out vuetify styles and global components
config.global.stubs = {
    transition: false,
    "v-app": true,
    "v-btn": true,
    "v-icon": true,
}

// Mock console.error to keep test logs clean
vi.spyOn(console, "error").mockImplementation(() => {})
