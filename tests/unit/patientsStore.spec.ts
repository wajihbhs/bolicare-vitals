import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import axios from "axios"
import { usePatientsStore } from "@/stores/patients"
import { CRITICAL_STATUS, STABLE_STATUS, WATCH_STATUS } from "@/types"

vi.mock("axios")

describe("usePatientsStore", () => {
    let store: ReturnType<typeof usePatientsStore>

    beforeEach(() => {
        setActivePinia(createPinia())
        store = usePatientsStore()
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("initial state is correct", () => {
        expect(store.patients).toEqual([])
        expect(store.loading).toBe(false)
        expect(store.alerts).toEqual([])
    })

    it("fetchPatients() populates data and sets loading=false", async () => {
        vi.useFakeTimers()
        const mockData = [{ id: 1, name: "John Doe", vitals: {} }]
        ;(axios.get as any).mockResolvedValueOnce({ data: mockData })

        const promise = store.fetchPatients()
        expect(store.loading).toBe(true)

        await vi.runAllTimersAsync()
        await promise

        expect(store.loading).toBe(false)
        expect(store.patients).toEqual(mockData)
    })

    it("updatePatient() updates a patient and returns updated data", async () => {
        const mockPatient = { id: 1, name: "Alice", vitals: {} }
        store.patients = [mockPatient] as any
        const updated = JSON.parse(JSON.stringify(mockPatient));
        updated.name = "Alice New Name"

        ;(axios.put as any).mockResolvedValueOnce({ data: updated })
        const result = await store.updatePatient(updated)

        expect(result.name).toBe("Alice New Name")
        expect(store.patients[0]).toEqual(updated)
    })

    it("lastVitalRate() returns last element or null", () => {
        expect(store.lastVitalRate([1, 6, 3])).toBe(3)
        expect(store.lastVitalRate([])).toBeNull()
        expect(store.lastVitalRate(null)).toBeNull()
    })

    describe("getPatientStatus()", () => {
        const basePatient = {
            id: 1,
            age: 40,
            vitals: { heartRate: [], temperature: [], bloodPressure: [] },
        }

        it("returns STABLE_STATUS for normal vitals", () => {
            const p = {
                ...basePatient,
                vitals: {
                    heartRate: [70],
                    temperature: [37],
                    bloodPressure: [{ systolic: 130, diastolic: 70 }],
                },
            }
            expect(store.getPatientStatus(p as any)).toBe(STABLE_STATUS)
        })

        it("returns WATCH_STATUS for slightly abnormal vitals", () => {
            const p = {
                ...basePatient,
                vitals: {
                    heartRate: [100],
                    temperature: [38],
                    bloodPressure: [{ systolic: 150, diastolic: 90 }],
                },
            }
            expect(store.getPatientStatus(p as any)).toBe(WATCH_STATUS)
        })

        it("returns CRITICAL_STATUS for dangerous vitals", () => {
            const p = {
                ...basePatient,
                vitals: {
                    heartRate: [190],
                    temperature: [45],
                    bloodPressure: [{ systolic: 210, diastolic: 130 }],
                },
            }
            expect(store.getPatientStatus(p as any)).toBe(CRITICAL_STATUS)
        })
    })

    describe("checkAlerts()", () => {
        it("adds alerts for critical patient", () => {
            const patient = {
                id: 1,
                age: 30,
                vitals: {
                    heartRate: [200],
                    temperature: [43],
                    bloodPressure: [{ systolic: 210, diastolic: 130 }],
                },
            }
            store.patients = [patient] as any
            store.checkAlerts()

            const alerts = store.alerts
            expect(alerts.length).toBeGreaterThan(0)
            expect(alerts.some(a => a.level === CRITICAL_STATUS)).toBe(true)
        })

        it("adds alerts for watch-level patient", () => {
            const patient = {
                id: 2,
                age: 50,
                vitals: {
                    heartRate: [100],
                    temperature: [38],
                    bloodPressure: [{ systolic: 150, diastolic: 90 }],
                },
            }
            store.patients = [patient] as any
            store.checkAlerts()

            const alerts = store.alerts
            expect(alerts.length).toBeGreaterThan(0)
            expect(alerts.every(a => a.level === WATCH_STATUS)).toBe(true)
        })

        it("adds no alerts for stable patient", () => {
            const patient = {
                id: 3,
                age: 40,
                vitals: {
                    heartRate: [70],
                    temperature: [37],
                    bloodPressure: [{ systolic: 130, diastolic: 75 }],
                },
            }
            store.patients = [patient] as any
            store.checkAlerts()
            expect(store.alerts.length).toBe(0)
        })
    })
})
