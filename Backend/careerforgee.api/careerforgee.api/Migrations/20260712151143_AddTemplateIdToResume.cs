using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace careerforgee.api.Migrations
{
    /// <inheritdoc />
    public partial class AddTemplateIdToResume : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TemplateId",
                table: "Resumes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TemplateId",
                table: "Resumes");
        }
    }
}
