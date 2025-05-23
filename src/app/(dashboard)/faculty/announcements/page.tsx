"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Announcement } from "@/types/alert"
import toast from "react-hot-toast"

async function getAnnouncements() {

    try {

        const response = await fetch("/api/faculty/announcements")
        const data = await response.json()
        console.log(data)
        
        return data.data


        
    } catch (error) {
        
        console.log(error)
        

    }



    // return [
    //     { id: 1, title: "Important Update", message: "This is an important update.", role: "ADMIN", filters: {} },
    //     { id: 2, title: "New Policy", message: "Details about the new policy.", role: "FACULTY", filters: {} },
    // ];
}

export default function AnnouncementsList() {
    const router = useRouter()
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)

    useEffect(() => {
        getAnnouncements().then(setAnnouncements)
    }, [])

    const handleDelete = (announcement: Announcement) => {
        setAnnouncementToDelete(announcement)
        setShowDeleteConfirmation(true)
    }

    const confirmDelete = async () => {
        
        const response = await fetch(`/api/faculty/announcements/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(announcementToDelete),
        })

        const res = await response.json()
        console.log(res)
        
        if (response.ok) {
            setAnnouncements((prev) => prev.filter((a) => a.id !== announcementToDelete?.id))
            setShowDeleteConfirmation(false)
            toast.success("Announcement deleted successfully")
        } else {
            console.log("error")
        }


    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Announcements</h1>
                <Link href="/admin/announcements/create">
                    <Button>Create New Announcement</Button>
                </Link>
            </div>
            <div className="space-y-4">
                {announcements.length > 0 ? announcements.map((announcement) => (
                    <div key={announcement.id} className="flex justify-between items-center border p-4 rounded-lg">
                        <h2 className="text-xl font-semibold">{announcement.title}</h2>
                        <div>
                            <Button
                                variant="outline"
                                className="mr-2"
                                onClick={() => router.push(`/admin/announcements/update/${announcement?.id}`)}
                            >
                                Edit
                            </Button>
                            <Button variant="destructive" onClick={() => handleDelete(announcement)}>
                                Delete
                            </Button>
                        </div>
                    </div>
                )) : <p>No Announcement</p>}
            </div>

            <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the announcement &quot;{announcementToDelete?.title}&quot;? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

