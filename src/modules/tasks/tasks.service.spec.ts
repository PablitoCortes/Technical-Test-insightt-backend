import { tasksService } from "./tasks.service";
import { Task } from "./task.model";
import { TaskStatus } from "./tasks.types";
import { AppError } from "../../errors/AppError";

// Mock Mongoose model
jest.mock("./task.model");

describe("TasksService", () => {
  const mockOwnerId = "user123";
  const mockTaskId = "task123";

  describe("editTask", () => {
    it("should throw error if task is not found", async () => {
      (Task.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        tasksService.editTask(mockOwnerId, mockTaskId, { title: "New Title" })
      ).rejects.toThrow(new AppError("Task not found", 404));
    });

    it("should throw error if attempting to mark as DONE via update (must use complete endpoint)", async () => {
      const mockTask = { status: TaskStatus.PENDING };
      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);

      await expect(
        tasksService.editTask(mockOwnerId, mockTaskId, { status: TaskStatus.DONE })
      ).rejects.toThrow(new AppError("Use the complete endpoint to mark task as DONE", 400));
    });

    it("should throw error if task is ARCHIVED", async () => {
      const mockTask = { status: TaskStatus.ARCHIVED };
      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);

      await expect(
        tasksService.editTask(mockOwnerId, mockTaskId, { title: "New Title" })
      ).rejects.toThrow(new AppError("Archived tasks cannot be modified", 400));
    });

    it("should throw error if invalid status transition is attempted", async () => {
      const mockTask = {
        status: TaskStatus.PENDING,
        save: jest.fn()
      };
      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);

      // PENDING to DONE is invalid via update (and also logically invalid transition)
      await expect(
        tasksService.editTask(mockOwnerId, mockTaskId, { status: TaskStatus.ARCHIVED })
      ).rejects.toThrow(/Invalid status transition/);
    });

    it("should allow title update for DONE tasks but reject description/status changes", async () => {
      const mockTask = {
        status: TaskStatus.DONE,
        title: "Old Title",
        save: jest.fn()
      };
      (Task.findOne as jest.Mock).mockResolvedValue(mockTask);

      // Should succeed
      await tasksService.editTask(mockOwnerId, mockTaskId, { title: "Fix typo" });
      expect(mockTask.title).toBe("Fix typo");
      expect(mockTask.save).toHaveBeenCalled();

      // Should fail if changing description
      await expect(
        tasksService.editTask(mockOwnerId, mockTaskId, { description: "New desc" })
      ).rejects.toThrow(new AppError("Only title can be edited for completed tasks", 400));
    });
  });

  describe("deleteTask", () => {
    it("should throw error if task not found", async () => {
      (Task.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        tasksService.deleteTask(mockOwnerId, mockTaskId)
      ).rejects.toThrow(new AppError("Task not found", 404));
    });

    it("should throw error if user is not the owner", async () => {
      const mockTask = { ownerId: "otherUser" };
      (Task.findById as jest.Mock).mockResolvedValue(mockTask);

      await expect(
        tasksService.deleteTask(mockOwnerId, mockTaskId)
      ).rejects.toThrow(new AppError("Unauthorized", 403));
    });
  });
});
